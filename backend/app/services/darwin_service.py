from __future__ import annotations

import sys
from functools import lru_cache
from pathlib import Path
from typing import Any, Generator

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[3]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

load_dotenv(PROJECT_ROOT / ".env")


class DarwinService:
    def __init__(self, population_size: int = 5) -> None:
        self.population_size = population_size
        self.engine = self._load_engine()
        self._configure_core_paths()

    # ── Public API ──────────────────────────────────────────────────────────

    def run_evolution(self, task: str, generations: int) -> dict[str, Any]:
        """Run the full evolution loop and return a summary dict."""

        if generations < 1:
            raise ValueError("generations must be >= 1")

        result: dict[str, Any] = {}

        for event in self._run_evolution_stream(task, generations):
            if event.get("done"):
                result = event

        return result

    def stream_evolution(
        self,
        task: str,
        generations: int,
    ) -> Generator[dict[str, Any], None, None]:
        """
        Yield a progress dict after each generation completes.

        Each yielded dict contains:
            generation, total_generations, winner, score, done (bool)

        The final event has done=True and additionally contains
        history and winner_memory.
        """

        if generations < 1:
            raise ValueError("generations must be >= 1")

        yield from self._run_evolution_stream(task, generations)

    # ── Core loop ───────────────────────────────────────────────────────────

    def _run_evolution_stream(
        self,
        task: str,
        generations: int,
    ) -> Generator[dict[str, Any], None, None]:

        create_next_generation = self.engine["create_next_generation"]
        extract_winner_reasons = self.engine["extract_winner_reasons"]
        generate_random_agent = self.engine["generate_random_agent"]

        history = self._load_history()
        winner_memory = self._load_winner_memory()

        population = [
            generate_random_agent(i + 1)
            for i in range(self.population_size)
        ]

        best_winner: str | None = None
        best_score: int | float = 0

        for generation in range(1, generations + 1):

            results = self._run_generation(
                task=task,
                population=population,
                winner_memory=winner_memory,
            )

            best = results[0]
            generation_score = self._coerce_score(best["score"]["total"])
            generation_winner = best["agent"].name

            if best_winner is None or generation_score > best_score:
                best_winner = generation_winner
                best_score = generation_score

            # ── Enrichment: extract population data ────────────────────────
            # All scores this generation (winner first after sort in
            # _run_generation).  No new LLM calls — already computed.
            population_scores: list[float] = [
                self._coerce_score(r["score"]["total"])
                for r in results
            ]

            # Winner genome as a plain dict — strip the 'name' key so only
            # the 5 numeric traits remain for analytics consumers.
            winner_genome_raw: dict[str, Any] = best["agent"].to_dict()
            winner_genome: dict[str, Any] = {
                k: v for k, v in winner_genome_raw.items() if k != "name"
            }

            # Trait snapshot == winner genome (same shape, explicit alias
            # so the history schema is self-documenting).
            trait_snapshot: dict[str, Any] = winner_genome.copy()
            # ─────────────────────────────────────────────────────────────

            winner_reasons = extract_winner_reasons(
                task,
                best["solution"],
                generation_score,
            )

            # Persist enriched history record
            history.add_generation(
                generation,
                generation_score,
                generation_winner,
                population_scores=population_scores,
                trait_snapshot=trait_snapshot,
                task=task,
            )

            winner_memory.add(
                generation,
                generation_winner,
                generation_score,
                best["agent"],
                winner_reasons,
            )

            # Read back the diversity_score that add_generation computed
            # from population_scores so we can include it in the SSE event.
            diversity_score = history.generations[-1].get("diversity_score")

            # Yield progress event for SSE streaming
            is_last = generation == generations

            if not is_last:
                population = create_next_generation(
                    results,
                    winner_memory,
                    generation=generation,
                    history=history,
                )

            yield {
                "generation": generation,
                "total_generations": generations,
                "winner": generation_winner,
                "score": generation_score,
                "done": is_last,
                # ── Enriched fields on every event ──────────────────────
                "winner_genome": winner_genome,
                "population_scores": population_scores,
                "diversity_score": diversity_score,
                # ────────────────────────────────────────────────────────
                **(
                    {
                        "task": task,
                        "generations": generations,
                        "best_winner": best_winner,
                        "best_score": best_score,
                        "history": history.generations,
                        "winner_memory": winner_memory.memories,
                    }
                    if is_last
                    else {}
                ),
            }

    def _run_generation(
        self,
        task: str,
        population: list[Any],
        winner_memory: Any,
    ) -> list[dict[str, Any]]:

        results = []
        build_agent_prompt = self.engine["build_agent_prompt"]
        run_agent = self.engine["run_agent"]
        rank_solutions = self.engine["rank_solutions"]
        attach_scores = self.engine["attach_scores"]

        for agent in population:
            prompt = build_agent_prompt(
                agent,
                task,
                winner_memory,
            )
            solution = run_agent(prompt)
            results.append(
                {
                    "agent": agent,
                    "solution": solution,
                }
            )

        rankings = rank_solutions(task, results)
        scored_results = attach_scores(results, rankings)

        for result in scored_results:
            score = result.setdefault("score", {"total": 0})
            score["total"] = self._coerce_score(score.get("total", 0))

        scored_results.sort(
            key=lambda item: item["score"]["total"],
            reverse=True,
        )
        return scored_results

    # ── Loaders ─────────────────────────────────────────────────────────────

    def _load_winner_memory(self) -> Any:
        WinnerMemory = self.engine["WinnerMemory"]
        winner_memory = WinnerMemory()
        winner_memory.file_path = str(PROJECT_ROOT / "memory" / "winner_memory.json")
        winner_memory.load()
        return winner_memory

    def _load_history(self) -> Any:
        EvolutionHistory = self.engine["EvolutionHistory"]
        history = EvolutionHistory()
        history.file_path = str(PROJECT_ROOT / "memory" / "history.json")
        history.load()
        return history

    def _configure_core_paths(self) -> None:
        (PROJECT_ROOT / "memory").mkdir(exist_ok=True)
        (PROJECT_ROOT / "cache").mkdir(exist_ok=True)
        cache_manager = self.engine["cache_manager"]
        cache_manager.CACHE_FILE = str(PROJECT_ROOT / "cache" / "cache_data.json")

    def _coerce_score(self, value: Any) -> int | float:
        try:
            score = float(value)
        except (TypeError, ValueError):
            return 0

        if score.is_integer():
            return int(score)
        return score

    def _load_engine(self) -> dict[str, Any]:
        from agents.agent_genome import generate_random_agent
        from agents.executor import run_agent
        from agents.prompt_builder import build_agent_prompt
        from cache import cache_manager
        from evolution.generation_runner import create_next_generation
        from judge.global_judge import rank_solutions
        from judge.ranking_utils import attach_scores
        from memory.evolution_history import EvolutionHistory
        from memory.winner_memory import WinnerMemory
        from memory.winner_reason_extractor import extract_winner_reasons

        return {
            "generate_random_agent": generate_random_agent,
            "run_agent": run_agent,
            "build_agent_prompt": build_agent_prompt,
            "cache_manager": cache_manager,
            "create_next_generation": create_next_generation,
            "rank_solutions": rank_solutions,
            "attach_scores": attach_scores,
            "EvolutionHistory": EvolutionHistory,
            "WinnerMemory": WinnerMemory,
            "extract_winner_reasons": extract_winner_reasons,
        }


@lru_cache(maxsize=1)
def get_darwin_service() -> DarwinService:
    return DarwinService()


def run_evolution(task: str, generations: int) -> dict[str, Any]:
    return get_darwin_service().run_evolution(task, generations)


def stream_evolution(
    task: str,
    generations: int,
) -> Generator[dict[str, Any], None, None]:
    yield from get_darwin_service().stream_evolution(task, generations)
