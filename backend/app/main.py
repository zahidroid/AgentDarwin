from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import analytics, evolution, health, memory


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Agent Darwin API",
        description="Production API surface for Agent Darwin evolution runs and memory access.",
        version="0.1.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(evolution.router)
    app.include_router(memory.router)
    app.include_router(analytics.router)

    return app


app = create_app()
