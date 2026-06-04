import random

from agents.agent_genome import AgentGenome


def crossover(parent1, parent2, child_name):

    # Uniform crossover: each trait is inherited independently
    # from either parent with equal probability (50/50).
    # The original trait value is preserved exactly —
    # no averaging — so the population retains the full
    # range of values present in the parent generation.
    return AgentGenome(
        name=child_name,

        creativity=random.choice([
            parent1.creativity,
            parent2.creativity
        ]),

        risk=random.choice([
            parent1.risk,
            parent2.risk
        ]),

        depth=random.choice([
            parent1.depth,
            parent2.depth
        ]),

        skepticism=random.choice([
            parent1.skepticism,
            parent2.skepticism
        ]),

        execution_focus=random.choice([
            parent1.execution_focus,
            parent2.execution_focus
        ]),
    )