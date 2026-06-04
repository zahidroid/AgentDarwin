from evolution.selector import select_survivors
from evolution.crossover import crossover
from evolution.mutation import mutate


def create_next_generation(
    results,
    winner_memory=None,
    generation=None,
    history=None
):

    survivors = select_survivors(
        results,
        top_k=2
    )

    parent1 = survivors[0]["agent"]
    parent2 = survivors[1]["agent"]

    new_population = [
        parent1,
        parent2
    ]

    for i in range(3):

        # Always embed the generation number so child names are unique
        # across runs.  Prior bug: all children were named Child_1/2/3
        # forever, corrupting ranking lookups in winner_memory.
        gen_label = generation if generation is not None else 0
        child_name = f"Child_G{gen_label}_{i + 1}"

        child = crossover(
            parent1,
            parent2,
            child_name
        )

        child = mutate(
            child,
            winner_memory,
            history=history
        )

        new_population.append(
            child
        )

    return new_population