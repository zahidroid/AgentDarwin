def get_trait_targets(
    winner_memory
):

    memories = winner_memory.memories

    if not memories:

        return None

    # Accumulate score-weighted sums in a single pass.
    # Each memory contributes its winner score as the weight,
    # so high-scoring winners pull the mutation target
    # proportionally harder than low-scoring ones.
    total_weight = 0.0

    weighted_creativity = 0.0
    weighted_risk = 0.0
    weighted_depth = 0.0
    weighted_skepticism = 0.0
    weighted_execution = 0.0

    for memory in memories:

        genome = memory["genome"]

        # Use score as the weight; fall back to 1.0 so that
        # memories with a missing or zero score still contribute
        # rather than being silently dropped.
        weight = float(
            memory.get("score") or 1.0
        )

        total_weight += weight

        weighted_creativity += (
            weight * genome["creativity"]
        )

        weighted_risk += (
            weight * genome["risk"]
        )

        weighted_depth += (
            weight * genome["depth"]
        )

        weighted_skepticism += (
            weight * genome["skepticism"]
        )

        weighted_execution += (
            weight * genome["execution_focus"]
        )

    # Return dict keys and value types are identical to the
    # previous implementation, so mutation.py needs no changes.
    return {
        "creativity":
            weighted_creativity / total_weight,

        "risk":
            weighted_risk / total_weight,

        "depth":
            weighted_depth / total_weight,

        "skepticism":
            weighted_skepticism / total_weight,

        "execution_focus":
            weighted_execution / total_weight,
    }