import json
import os
import sys
from functools import lru_cache
from pathlib import Path
from typing import Any

from fastapi import HTTPException, status

PROJECT_ROOT = Path(__file__).resolve().parents[3]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


class MemoryService:
    def __init__(self, project_root: Path | None = None) -> None:
        self.project_root = project_root or PROJECT_ROOT
        self.winner_memory_path = Path(
            os.getenv(
                "AGENT_DARWIN_WINNER_MEMORY_PATH",
                self.project_root / "memory" / "winner_memory.json",
            )
        )
        history_path = os.getenv("AGENT_DARWIN_HISTORY_PATH")
        self.history_candidates = [
            Path(history_path) if history_path else None,
            self.project_root / "memory" / "history.json",
            self.project_root / "memory" / "evolution_history.json",
            self.project_root / "history.json",
            self.project_root / "evolution_history.json",
        ]

    def get_winner_memory(self) -> Any:
        return self._read_json_file(self.winner_memory_path, default=[])

    def get_history(self) -> Any:
        for path in self.history_candidates:
            if path and path.exists():
                return self._read_json_file(path, default=[])
        return []

    def get_rules(self):
        """Extract emergent rules from winner memory using rule_extractor."""
        from app.schemas.memory import RulesResponse, RuleItem

        try:
            from memory.rule_extractor import extract_rules
            from memory.winner_memory import WinnerMemory

            winner_memory = WinnerMemory()
            winner_memory.file_path = str(
                self.project_root / "memory" / "winner_memory.json"
            )
            winner_memory.load()

            rules = extract_rules(winner_memory)

            return RulesResponse(
                strengths=[
                    RuleItem(label=label, count=count)
                    for label, count in rules.get("strengths", [])
                ],
                pitfalls=[
                    RuleItem(label=label, count=count)
                    for label, count in rules.get("pitfalls", [])
                ],
            )

        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Rule extraction failed: {exc}",
            ) from exc

    def _read_json_file(self, path: Path, default: Any) -> Any:
        if not path.exists():
            return default

        try:
            with path.open("r", encoding="utf-8") as file:
                return json.load(file)
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Invalid JSON in {path.name}.",
            ) from exc
        except OSError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unable to read {path.name}.",
            ) from exc


@lru_cache(maxsize=1)
def get_memory_service() -> MemoryService:
    return MemoryService()
