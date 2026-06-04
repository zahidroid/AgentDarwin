from memory.winner_memory import WinnerMemory
from memory.trait_analyzer import analyze_traits
from memory.analyzer import summarize_winner
from memory.winner_reason_extractor import (
    extract_winner_reasons
)

from agents.agent_genome import generate_random_agent
from agents.prompt_builder import build_agent_prompt
from agents.executor import run_agent

from judge.global_judge import rank_solutions
from judge.ranking_utils import attach_scores

from evolution.generation_runner import (
    create_next_generation
)
from memory.rule_report import (
    show_rules
)
from memory.evolution_history import (
    EvolutionHistory
)

TASK = """
Design a startup that helps college students prepare for technical interviews using AI.
"""

NUM_GENERATIONS = 2

history = EvolutionHistory()
winner_memory = WinnerMemory()

population = [
    generate_random_agent(i + 1)
    for i in range(5)
]

for generation in range(
    1,
    NUM_GENERATIONS + 1
):

    print(
        f"\n{'='*20}"
        f" GENERATION {generation} "
        f"{'='*20}"
    )

    results = []

    # Generate solutions
    for agent in population:

        prompt = build_agent_prompt(
            agent,
            TASK,
            winner_memory
        )

        solution = run_agent(prompt)

        results.append(
            {
                "agent": agent,
                "solution": solution
            }
        )

    # Global Judge evaluates ALL solutions together
    rankings = rank_solutions(
        TASK,
        results
    )

    # Attach scores — unranked agents default to score 0
    results = attach_scores(
        results,
        rankings
    )

    # Sort by score — guarded: all results now guaranteed to have score key
    results.sort(
        key=lambda x: x["score"]["total"],
        reverse=True
    )

    print("\nRANKINGS\n")

    for result in results:

        print(
            result["agent"].name,
            "->",
            result["score"]["total"]
        )

    best = results[0]

    winner_reasons = extract_winner_reasons(
        TASK,
        best["solution"],
        best["score"]["total"]
    )

    # Persist generation to history (was never called before — fix)
    history.add_generation(
        generation,
        best["score"]["total"],
        best["agent"].name
    )

    winner_memory.add(
        generation,
        best["agent"].name,
        best["score"]["total"],
        best["agent"],
        winner_reasons
    )

    population = create_next_generation(
        results,
        winner_memory,
        generation=generation,
        history=history
    )

history.show()

winner_memory.show()

summarize_winner(
    winner_memory
)

analyze_traits(
    winner_memory
)

show_rules(
    winner_memory
)