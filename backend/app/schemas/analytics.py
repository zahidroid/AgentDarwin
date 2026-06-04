"""
Pydantic schemas for the /api/v1/analytics endpoint.

These types are consumed by the frontend Genome Explorer page
to power trait evolution and diversity visualizations.
"""

from typing import Any

from pydantic import BaseModel, Field


class TraitEvolutionPoint(BaseModel):
    """
    One data-point in the trait evolution time series.

    generation     — 1-based generation index
    creativity     — winner's creativity trait (0-100)
    risk           — winner's risk-tolerance trait (0-100)
    depth          — winner's depth-of-analysis trait (0-100)
    skepticism     — winner's skepticism trait (0-100)
    execution_focus — winner's execution-focus trait (0-100)

    Any trait may be None for historical records written before
    this enrichment was added (backward-compatible).
    """

    generation: int
    creativity: float | None = None
    risk: float | None = None
    depth: float | None = None
    skepticism: float | None = None
    execution_focus: float | None = None


class DiversityPoint(BaseModel):
    """
    One data-point in the population diversity time series.

    generation      — 1-based generation index
    diversity_score — std-dev of all agent scores this generation;
                      None for legacy records that predate enrichment
    population_min  — lowest score this generation
    population_max  — highest score this generation
    population_mean — mean score this generation
    """

    generation: int
    diversity_score: float | None = None
    population_min: float | None = None
    population_max: float | None = None
    population_mean: float | None = None


class AnalyticsResponse(BaseModel):
    """
    Full analytics payload returned by GET /api/v1/analytics.

    trait_evolution  — one TraitEvolutionPoint per persisted generation,
                       ordered by generation ASC
    diversity_series — one DiversityPoint per persisted generation,
                       ordered by generation ASC
    total_generations — total number of generation records in history
    """

    trait_evolution: list[TraitEvolutionPoint] = Field(default_factory=list)
    diversity_series: list[DiversityPoint] = Field(default_factory=list)
    total_generations: int = 0
    meta: dict[str, Any] = Field(
        default_factory=dict,
        description=(
            "Optional metadata: earliest/latest generation task, "
            "data completeness flags, etc."
        ),
    )
