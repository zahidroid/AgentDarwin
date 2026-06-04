from fastapi import APIRouter, Depends

from app.schemas.memory import HistoryResponse, RulesResponse, WinnerMemoryResponse
from app.services.memory_service import MemoryService, get_memory_service

router = APIRouter(tags=["memory"])


@router.get("/winner-memory", response_model=WinnerMemoryResponse)
def get_winner_memory(
    service: MemoryService = Depends(get_memory_service),
) -> WinnerMemoryResponse:
    return WinnerMemoryResponse(memories=service.get_winner_memory())


@router.get("/history", response_model=HistoryResponse)
def get_history(
    service: MemoryService = Depends(get_memory_service),
) -> HistoryResponse:
    return HistoryResponse(history=service.get_history())


@router.get("/rules", response_model=RulesResponse)
def get_rules(
    service: MemoryService = Depends(get_memory_service),
) -> RulesResponse:
    """
    Return emergent rules extracted from winner memory.

    Strength rules: phrases appearing in winning solutions >= 2 times.
    Pitfall rules: improvement gaps recurring across >= 2 winners.
    """
    return service.get_rules()
