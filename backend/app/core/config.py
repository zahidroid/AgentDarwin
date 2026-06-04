import os
from functools import lru_cache
from typing import Literal

from pydantic import BaseModel, Field


class Settings(BaseModel):
    environment: Literal["local", "development", "staging", "production"] = Field(
        default="local"
    )
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]
    )


def _parse_csv(value: str | None) -> list[str] | None:
    if not value:
        return None

    values = [item.strip() for item in value.split(",") if item.strip()]
    return values or None


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    environment = os.getenv("APP_ENV", "local")
    cors_origins = _parse_csv(os.getenv("CORS_ORIGINS"))
    if cors_origins is None:
        return Settings(environment=environment)
    return Settings(environment=environment, cors_origins=cors_origins)
