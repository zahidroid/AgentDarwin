from typing import Any

from pydantic import BaseModel, Field


class WinnerMemoryResponse(BaseModel):
    memories: Any = Field(default_factory=list)


class HistoryResponse(BaseModel):
    history: Any = Field(default_factory=list)


class RuleItem(BaseModel):
    label: str
    count: int


class RulesResponse(BaseModel):
    strengths: list[RuleItem] = Field(default_factory=list)
    pitfalls: list[RuleItem] = Field(default_factory=list)
