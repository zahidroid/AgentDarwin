from dataclasses import dataclass


@dataclass
class AgentResult:

    agent_name: str

    genome: dict

    solution: str

    score: dict