def summarize_winner(memory):

    genomes = memory.memories

    if not genomes:
        return

    latest = genomes[-1]

    print("\nLATEST WINNER PROFILE\n")

    print(
        f"Winner: {latest['winner']}"
    )

    print(
        f"Score: {latest['score']}"
    )

    print(
        f"Traits: {latest['genome']}"
    )