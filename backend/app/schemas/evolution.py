from typing import Any

from pydantic import BaseModel, Field


class EvolutionRunRequest(BaseModel):
    task: str = Field(..., min_length=1)
    generations: int = Field(default=2, ge=1)


class EvolutionRunResponse(BaseModel):
    task: str
    generations: int
    winner: str | None
    best_score: int | float
    history: list[dict[str, Any]] = Field(default_factory=list)
    winner_memory: list[dict[str, Any]] = Field(default_factory=list)


class GenerationEvent(BaseModel):
    """Payload emitted per-generation via the SSE streaming endpoint."""

    generation: int
    total_generations: int
    winner: str
    score: int | float
    done: bool = False
