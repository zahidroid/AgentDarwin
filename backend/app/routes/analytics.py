"""
Analytics route — GET /api/v1/analytics

Returns two time series computed from persisted history.json:

  trait_evolution  — winner genome traits per generation
  diversity_series — population score statistics per generation

No LLM calls are made. All data is derived from the history file
written by evolution_history.py during each run.
"""

from fastapi import APIRouter, Depends

from app.schemas.analytics import (
    AnalyticsResponse,
    DiversityPoint,
    TraitEvolutionPoint,
)
from app.services.memory_service import MemoryService, get_memory_service

router = APIRouter(tags=["analytics"])

_TRAIT_KEYS = ("creativity", "risk", "depth", "skepticism", "execution_focus")


def _build_trait_evolution(history: list[dict]) -> list[TraitEvolutionPoint]:
    """
    Map each generation record to a TraitEvolutionPoint.

    Records written before Phase-1 enrichment will have no trait_snapshot;
    their trait fields will be None, which is valid per the schema.
    """
    points: list[TraitEvolutionPoint] = []

    for record in history:
        snapshot: dict = record.get("trait_snapshot") or {}
        points.append(
            TraitEvolutionPoint(
                generation=record["generation"],
                creativity=snapshot.get("creativity"),
                risk=snapshot.get("risk"),
                depth=snapshot.get("depth"),
                skepticism=snapshot.get("skepticism"),
                execution_focus=snapshot.get("execution_focus"),
            )
        )

    return points


def _build_diversity_series(history: list[dict]) -> list[DiversityPoint]:
    """
    Map each generation record to a DiversityPoint.

    population_min / mean / max are derived from population_scores when
    available.  diversity_score is taken directly from the stored value
    (which was computed as std-dev by EvolutionHistory.add_generation).
    """
    points: list[DiversityPoint] = []

    for record in history:
        scores: list[float] | None = record.get("population_scores")

        pop_min: float | None = None
        pop_max: float | None = None
        pop_mean: float | None = None

        if scores:
            pop_min = round(min(scores), 4)
            pop_max = round(max(scores), 4)
            pop_mean = round(sum(scores) / len(scores), 4)

        points.append(
            DiversityPoint(
                generation=record["generation"],
                diversity_score=record.get("diversity_score"),
                population_min=pop_min,
                population_max=pop_max,
                population_mean=pop_mean,
            )
        )

    return points


@router.get("/api/v1/analytics", response_model=AnalyticsResponse)
def get_analytics(
    service: MemoryService = Depends(get_memory_service),
) -> AnalyticsResponse:
    """
    Return trait evolution and diversity time series derived from
    the persisted evolution history.

    Both series are ordered by generation ASC.
    Records predating Phase-1 enrichment will have None for the new
    fields — the frontend must handle sparse data gracefully.
    """
    history: list[dict] = service.get_history()

    # Sort defensively — history is normally written in order, but
    # manual edits or concurrent runs could disrupt ordering.
    history_sorted = sorted(history, key=lambda r: r.get("generation", 0))

    trait_evolution = _build_trait_evolution(history_sorted)
    diversity_series = _build_diversity_series(history_sorted)

    # Collect optional metadata
    tasks_seen = list(
        dict.fromkeys(
            r["task"] for r in history_sorted if r.get("task")
        )
    )

    enriched_count = sum(
        1 for r in history_sorted if r.get("trait_snapshot") is not None
    )

    meta = {
        "tasks": tasks_seen,
        "enriched_generations": enriched_count,
        "legacy_generations": len(history_sorted) - enriched_count,
    }

    return AnalyticsResponse(
        trait_evolution=trait_evolution,
        diversity_series=diversity_series,
        total_generations=len(history_sorted),
        meta=meta,
    )
