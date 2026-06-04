from dataclasses import dataclass
import random


@dataclass
class AgentGenome:
    name: str
    creativity: int
    risk: int
    depth: int
    skepticism: int
    execution_focus: int

    def to_dict(self):
        return {
            "name": self.name,
            "creativity": self.creativity,
            "risk": self.risk,
            "depth": self.depth,
            "skepticism": self.skepticism,
            "execution_focus": self.execution_focus
        }


def generate_random_agent(agent_id: int):

    return AgentGenome(
        name=f"Agent_{agent_id}",
        creativity=random.randint(0, 100),
        risk=random.randint(0, 100),
        depth=random.randint(0, 100),
        skepticism=random.randint(0, 100),
        execution_focus=random.randint(0, 100)
    )