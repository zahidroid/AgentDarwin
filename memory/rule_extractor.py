from collections import Counter


def extract_rules(winner_memory):
    """
    Extract emergent rules from winner memory using verbatim frequency counting.

    LLM-generated prose is naturally diverse: even for the same task the
    model rephrases strengths differently each run, so verbatim exact-match
    counts rarely exceed 1.  Threshold is therefore 1 -- every observed rule
    is shown, ordered by frequency so genuinely recurring ones rank first.

    Rules cover both "what works" (strengths) and "what's consistently
    missing" (pitfalls/improvements), generalising to any task automatically.
    """

    strength_counter: Counter = Counter()
    pitfall_counter: Counter = Counter()

    for memory in winner_memory.memories:

        reasons = memory.get("reasons", {}) or {}

        for strength in reasons.get("strengths", []):
            label = strength.strip()
            if label:
                strength_counter[label] += 1

        for improvement in reasons.get("improvements", []):
            label = improvement.strip()
            if label:
                pitfall_counter[label] += 1

    # Show all rules ordered by frequency descending (threshold = 1).
    # Genuinely recurring strings naturally bubble to the top.
    strength_rules = sorted(
        [(label, count) for label, count in strength_counter.items()],
        key=lambda x: x[1],
        reverse=True,
    )

    pitfall_rules = sorted(
        [(label, count) for label, count in pitfall_counter.items()],
        key=lambda x: x[1],
        reverse=True,
    )

    # Cap at top 15 each to keep the page readable
    return {
        "strengths": strength_rules[:15],
        "pitfalls":  pitfall_rules[:15],
    }