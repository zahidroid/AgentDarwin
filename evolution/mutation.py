import random

from memory.trait_guidance import (
    get_trait_targets
)


# ── Adaptive mutation strength ─────────────────────────────────────────────
#
# Simulated annealing principle:
#   - When the population is stagnating (last 3 winner scores within ±3 of
#     each other) we increase the mutation strength to escape local optima.
#   - When scores are actively improving we keep strength low to exploit the
#     current trajectory.
#
# Strength levels:
#   EXPLORE  = ±25  (plateau detected — shake the population)
#   EXPLOIT  = ±10  (improving — make fine-grained adjustments)

STRENGTH_EXPLOIT = 10
STRENGTH_EXPLORE = 25
PLATEAU_THRESHOLD = 3   # score variance within this range = plateau
PLATEAU_WINDOW = 3      # look back this many generations


def _detect_plateau(history) -> bool:
    """Return True if the last PLATEAU_WINDOW scores are within PLATEAU_THRESHOLD."""

    if history is None:
        return False

    generations = history.generations

    if len(generations) < PLATEAU_WINDOW:
        return False

    recent_scores = [
        g.get("best_score", 0)
        for g in generations[-PLATEAU_WINDOW:]
    ]

    score_range = max(recent_scores) - min(recent_scores)

    return score_range <= PLATEAU_THRESHOLD


def _adaptive_strength(history) -> int:

    if _detect_plateau(history):

        return STRENGTH_EXPLORE

    return STRENGTH_EXPLOIT


def guided_value(
    current,
    target,
    strength
):

    if target is None:

        return (
            current
            + random.randint(
                -strength,
                strength
            )
        )

    pull = (
        target
        - current
    ) * 0.2

    mutation = random.randint(
        -strength,
        strength
    )

    return int(
        current
        + pull
        + mutation
    )


def mutate(
    agent,
    winner_memory=None,
    history=None
):

    # Determine mutation strength adaptively
    mutation_strength = _adaptive_strength(history)

    if mutation_strength == STRENGTH_EXPLORE:
        print(f"[MUTATION] Plateau detected — exploring with strength ±{mutation_strength}")
    else:
        print(f"[MUTATION] Exploiting with strength ±{mutation_strength}")

    targets = None

    if winner_memory:

        targets = get_trait_targets(
            winner_memory
        )

    agent.creativity = guided_value(
        agent.creativity,
        targets["creativity"]
        if targets else None,
        mutation_strength
    )

    agent.risk = guided_value(
        agent.risk,
        targets["risk"]
        if targets else None,
        mutation_strength
    )

    agent.depth = guided_value(
        agent.depth,
        targets["depth"]
        if targets else None,
        mutation_strength
    )

    agent.skepticism = guided_value(
        agent.skepticism,
        targets["skepticism"]
        if targets else None,
        mutation_strength
    )

    agent.execution_focus = guided_value(
        agent.execution_focus,
        targets["execution_focus"]
        if targets else None,
        mutation_strength
    )

    agent.creativity = max(
        0,
        min(100, agent.creativity)
    )

    agent.risk = max(
        0,
        min(100, agent.risk)
    )

    agent.depth = max(
        0,
        min(100, agent.depth)
    )

    agent.skepticism = max(
        0,
        min(100, agent.skepticism)
    )

    agent.execution_focus = max(
        0,
        min(100, agent.execution_focus)
    )

    return agent