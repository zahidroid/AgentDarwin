def synthesize_lessons(
    winner_memory
):

    memories = winner_memory.memories

    # ── Strengths (existing behaviour, unchanged) ──────────────────────────

    strengths = []

    for memory in memories[-5:]:

        reasons = memory.get(
            "reasons",
            {}
        )

        strengths.extend(
            reasons.get(
                "strengths",
                []
            )[:2]
        )

    # ── Pitfalls: recurring improvements from winning solutions ────────────
    #
    # Strategy:
    #   1. Walk the same rolling window (last 5 memories).
    #   2. Accumulate each improvement string together with the winner score
    #      so that higher-scoring winners contribute more weight.
    #   3. Deduplicate by checking whether any already-seen improvement
    #      shares a significant word overlap with the candidate (simple
    #      token-set intersection, no external deps needed).
    #   4. Rank survivors by total accumulated weight and keep the top 4.

    # Step 1 – collect weighted improvements from the window.
    # Each entry: (improvement_text, score_weight)
    weighted_improvements = []

    for memory in memories[-5:]:

        reasons = memory.get(
            "reasons",
            {}
        )

        # Use the winner score as weight; fall back to 1.0 so that
        # entries with a missing score still contribute.
        weight = float(
            memory.get("score") or 1.0
        )

        for improvement in reasons.get(
            "improvements",
            []
        ):

            weighted_improvements.append(
                (improvement, weight)
            )

    # Step 2 – deduplicate via token-set overlap.
    # Two strings are considered duplicates when they share ≥ 40 % of
    # their meaningful tokens (words longer than 3 chars, lowercased).

    def meaningful_tokens(text):

        return {
            w.lower()
            for w in text.split()
            if len(w) > 3
        }

    def is_duplicate(candidate, seen_texts):

        candidate_tokens = meaningful_tokens(candidate)

        if not candidate_tokens:
            return False

        for seen in seen_texts:

            seen_tokens = meaningful_tokens(seen)

            if not seen_tokens:
                continue

            overlap = len(
                candidate_tokens & seen_tokens
            )

            smaller = min(
                len(candidate_tokens),
                len(seen_tokens)
            )

            if overlap / smaller >= 0.40:
                return True

        return False

    # Step 3 – build a score-weighted frequency map for unique improvements.
    # key: canonical improvement text (first occurrence wins)
    # value: total accumulated weight
    weight_map = {}     # text -> total weight
    order = []          # preserves insertion order for stable output

    for text, weight in weighted_improvements:

        matched_key = None

        for key in order:

            if is_duplicate(text, [key]):
                matched_key = key
                break

        if matched_key is not None:
            weight_map[matched_key] += weight

        else:
            weight_map[text] = weight
            order.append(text)

    # Step 4 – rank by total weight, keep top 4.
    ranked = sorted(
        order,
        key=lambda t: weight_map[t],
        reverse=True
    )

    pitfalls = ranked[:4]

    return {
        "strengths": strengths,
        "pitfalls": pitfalls
    }