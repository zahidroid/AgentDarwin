from app.schemas.evolution import EvolutionRunRequest, EvolutionRunResponse
from app.services.darwin_service import run_evolution


class EvolutionService:
    def run(self, request: EvolutionRunRequest) -> EvolutionRunResponse:
        result = run_evolution(
            task=request.task,
            generations=request.generations,
        )
        return EvolutionRunResponse(**result)


def get_evolution_service() -> EvolutionService:
    return EvolutionService()
