# Agent Darwin Backend

Production-oriented FastAPI backend for Agent Darwin.

## Features

- `GET /health` returns service health.
- `POST /api/v1/run-evolution` executes the Agent Darwin engine.
- `GET /winner-memory` returns stored winner memories from `memory/winner_memory.json`.
- `GET /history` returns evolution history from a configured or conventional history file.
- CORS middleware is enabled for frontend integration.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

Interactive docs are available at `http://127.0.0.1:8000/docs`.

## Run Evolution

```bash
curl -X POST http://127.0.0.1:8000/api/v1/run-evolution \
  -H "Content-Type: application/json" \
  -d "{\"task\":\"Design an AI interview prep startup\",\"generations\":2}"
```

## Configuration

Optional environment variables:

- `APP_ENV`: application environment (`local`, `development`, `staging`, or `production`).
- `CORS_ORIGINS`: comma-separated list of allowed frontend origins.
- `AGENT_DARWIN_WINNER_MEMORY_PATH`: override the winner memory JSON path.
- `AGENT_DARWIN_HISTORY_PATH`: override the evolution history JSON path.
