from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class EvolutionRunStatus(str, Enum):
    QUEUED = "queued"


class EvolutionRun(BaseModel):
    run_id: str = Field(..., description="Unique identifier for the requested run.")
    status: EvolutionRunStatus
    message: str
    parameters: dict[str, Any] = Field(default_factory=dict)
