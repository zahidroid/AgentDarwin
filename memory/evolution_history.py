import json
import math
import os


class EvolutionHistory:

    def __init__(self):

        self.file_path = "memory/history.json"

        self.generations = []

        self.load()

    def load(self):

        if os.path.exists(self.file_path):

            try:

                with open(
                    self.file_path,
                    "r",
                    encoding="utf-8"
                ) as file:

                    self.generations = json.load(file)

            except Exception:

                self.generations = []

    def save(self):

        os.makedirs(
            os.path.dirname(
                os.path.abspath(self.file_path)
            ),
            exist_ok=True
        )

        with open(
            self.file_path,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                self.generations,
                file,
                indent=4
            )

    # ── Diversity helper ────────────────────────────────────────────────────

    @staticmethod
    def _compute_diversity(scores: list[float]) -> float | None:
        """
        Return the population diversity score as the standard deviation of
        all agent scores within a generation.

        A higher value means the population spans a wider fitness range —
        an indicator that selective pressure has not yet collapsed diversity.
        Returns None when fewer than 2 scores are provided.
        """
        if len(scores) < 2:
            return None

        n = len(scores)
        mean = sum(scores) / n
        variance = sum((s - mean) ** 2 for s in scores) / n

        return round(math.sqrt(variance), 4)

    # ── Public write interface ──────────────────────────────────────────────

    def add_generation(
        self,
        generation_number,
        best_score,
        winner_name,
        *,
        population_scores: list[float] | None = None,
        trait_snapshot: dict | None = None,
        diversity_score: float | None = None,
        task: str | None = None,
    ):
        """
        Persist one generation record.

        Required (unchanged, backward-compatible):
            generation_number  int    — 1-based generation index
            best_score         float  — score of the winning agent
            winner_name        str    — name of the winning agent

        Optional enrichments (all default to None so old call sites work):
            population_scores  list[float]  — all agent scores this generation
            trait_snapshot     dict         — winner genome traits {name: value}
            diversity_score    float        — std-dev of population scores;
                                             computed automatically when
                                             population_scores is provided and
                                             this argument is None
            task               str          — task description for this run
        """

        # Auto-compute diversity when scores are available but diversity
        # was not explicitly supplied by the caller.
        if population_scores is not None and diversity_score is None:
            diversity_score = self._compute_diversity(population_scores)

        record: dict = {
            "generation": generation_number,
            "best_score": best_score,
            "winner": winner_name,
        }

        # Only add enriched fields that were actually provided — keeps old
        # records stored before this change readable without null noise.
        if population_scores is not None:
            record["population_scores"] = [
                round(float(s), 4) for s in population_scores
            ]

        if trait_snapshot is not None:
            record["trait_snapshot"] = trait_snapshot

        if diversity_score is not None:
            record["diversity_score"] = round(float(diversity_score), 4)

        if task is not None:
            record["task"] = task

        self.generations.append(record)

        self.save()

    def show(self):

        print("\nEVOLUTION HISTORY\n")

        for item in self.generations:

            diversity = item.get("diversity_score")
            diversity_str = (
                f" | Diversity: {diversity}"
                if diversity is not None
                else ""
            )

            print(
                f"Generation {item['generation']} "
                f"| Winner: {item['winner']} "
                f"| Score: {item['best_score']}"
                f"{diversity_str}"
            )