"""
Cross-generation reflection for Agent Darwin.

After each generation this module compares the current winner score
against the all-time historical best.  When a significant regression
is detected, it returns a warning string that prompt_builder.py injects
into the next generation's prompt, nudging agents to try a different
approach rather than repeating a losing strategy.
"""


# A regression is flagged when the current score drops more than this
# many points below the all-time best across all generations.
REGRESSION_THRESHOLD = 10


def reflect(history, winner_memory) -> str | None:
    """
    Compare the most recent generation score against historical best.

    Returns a warning string when regression is detected, or None when
    the evolution is on track (improving or holding steady).
    """

    if history is None:
        return None

    generations = history.generations

    if not generations:
        return None

    # All-time best score across the entire run history
    all_scores = [
        g.get("best_score", 0)
        for g in generations
    ]

    if not all_scores:
        return None

    all_time_best = max(all_scores)
    current_score = generations[-1].get("best_score", 0)

    regression = all_time_best - current_score

    if regression > REGRESSION_THRESHOLD:

        return (
            f"WARNING — Regression detected: the current best score "
            f"({current_score}) has dropped {regression:.1f} points below "
            f"the historical best ({all_time_best}). "
            "Try a fundamentally different approach. "
            "Do not repeat strategies from recent generations."
        )

    # Also detect multi-generation stagnation (no improvement in 3+ gens)
    if len(generations) >= 4:

        recent = [g.get("best_score", 0) for g in generations[-4:]]
        recent_best = max(recent)
        recent_min = min(recent)

        if (recent_best - recent_min) <= 2 and recent_best < all_time_best:

            return (
                "NOTE — The population has been stagnating for 4 generations "
                "with no meaningful score improvement. "
                "Consider higher creativity and risk-taking to escape this plateau."
            )

    return None
