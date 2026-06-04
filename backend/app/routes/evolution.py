import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.schemas.evolution import EvolutionRunRequest, EvolutionRunResponse
from app.services.darwin_service import (
    DarwinService,
    get_darwin_service,
    stream_evolution,
)
from app.services.evolution_service import EvolutionService, get_evolution_service

router = APIRouter(tags=["evolution"])


@router.post(
    "/api/v1/run-evolution",
    response_model=EvolutionRunResponse,
)
def run_evolution(
    payload: EvolutionRunRequest,
    service: EvolutionService = Depends(get_evolution_service),
) -> EvolutionRunResponse:
    return service.run(payload)


@router.post("/api/v1/run-evolution/stream")
def run_evolution_stream(
    payload: EvolutionRunRequest,
    service: DarwinService = Depends(get_darwin_service),
) -> StreamingResponse:
    """
    Server-Sent Events endpoint that emits a JSON event after each generation.

    Client usage:
        const es = new EventSource('/api/v1/run-evolution/stream')
        es.onmessage = (e) => { const event = JSON.parse(e.data); ... }

    Each event payload:
        { generation, total_generations, winner, score, done }

    The final event (done=true) also contains:
        { task, generations, best_winner, best_score, history, winner_memory }
    """

    def event_generator():
        for event in service.stream_evolution(
            task=payload.task,
            generations=payload.generations,
        ):
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
