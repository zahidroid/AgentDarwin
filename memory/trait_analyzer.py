def analyze_traits(winner_memory):

    memories = winner_memory.memories

    if not memories:
        return

    creativity = []
    risk = []
    depth = []
    skepticism = []
    execution = []

    for memory in memories:

        genome = memory["genome"]

        creativity.append(
            genome["creativity"]
        )

        risk.append(
            genome["risk"]
        )

        depth.append(
            genome["depth"]
        )

        skepticism.append(
            genome["skepticism"]
        )

        execution.append(
            genome["execution_focus"]
        )

    print("\nWINNING TRAIT ANALYSIS\n")

    print(
        f"Creativity Avg: "
        f"{sum(creativity)/len(creativity):.2f}"
    )

    print(
        f"Risk Avg: "
        f"{sum(risk)/len(risk):.2f}"
    )

    print(
        f"Depth Avg: "
        f"{sum(depth)/len(depth):.2f}"
    )

    print(
        f"Skepticism Avg: "
        f"{sum(skepticism)/len(skepticism):.2f}"
    )

    print(
        f"Execution Avg: "
        f"{sum(execution)/len(execution):.2f}"
    )