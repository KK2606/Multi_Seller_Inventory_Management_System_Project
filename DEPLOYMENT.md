# Deployment Guide

This repository supports local development and a single-image Docker build. It does not include Docker Compose, cloud provider manifests, CI/CD workflows, reverse proxy configuration, HTTPS certificates, or database migration tooling.

## Deployment Architecture

```mermaid
flowchart LR
    Dev["Developer / CI host"] --> Build["docker build"]
    Build --> FrontendStage["Stage 1: node:22<br/>npm install<br/>npm run build"]
    FrontendStage --> BackendStage["Stage 2: python:3.12<br/>pip install backend requirements"]
    BackendStage --> Image["inventory-system-v2 image<br/>backend + static frontend"]
    Image --> Container["Uvicorn container<br/>main:app"]
    Container -->|DATABASE_URL| Postgres[("External PostgreSQL")]
    User["Browser"] -->|HTTP :8000| Container
```

## Runtime Requirements

| Requirement | Notes |
| --- | --- |
| PostgreSQL | Must be reachable from the backend container or local backend process |
| `DATABASE_URL` | Required by SQLAlchemy |
| `ADMIN_KEY` | Required for `/admin/admin_dashboard` |
| `RUNNING_IN_DOCKER=true` | Required for FastAPI to mount the built React frontend from `static/` |
| `PORT` | Optional for Docker; defaults to `8000` in the Dockerfile command |

## Local Backend Deployment

Run from `backend/`.

```powershell
cd backend
python -m venv v_env
.\v_env\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
ADMIN_KEY=replace-with-your-admin-key
```

Start the backend:

```powershell
uvicorn main:app --reload
```

Local backend URL:

```text
http://127.0.0.1:8000
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

## Local Frontend Deployment

Run from `frontend/`.

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start Vite:

```powershell
npm run dev
```

Build static frontend assets:

```powershell
npm run build
```

Preview the production build locally:

```powershell
npm run preview
```

## Docker Build

Build from the repository root:

```powershell
docker build -t inventory-system-v2 .
```

The Dockerfile performs two stages:

1. `node:22` builds the React frontend into `frontend/dist`.
2. `python:3.12` installs backend dependencies, copies backend source, copies `frontend/dist` into `/app/static`, and starts Uvicorn.

## Docker Run

Use a runtime env file with at least:

```env
DATABASE_URL=postgresql://username:password@host.docker.internal:5432/database_name
ADMIN_KEY=replace-with-your-admin-key
RUNNING_IN_DOCKER=true
```

Run:

```powershell
docker run --rm -p 8000:8000 --env-file backend/.env.docker inventory-system-v2
```

The app is served at:

```text
http://localhost:8000
```

With `RUNNING_IN_DOCKER=true`, `backend/main.py` mounts:

```python
app.mount("/", StaticFiles(directory="static", html=True), name="frontend")
```

Without that environment variable, the container still runs the API, but the built React frontend is not mounted at `/`.

## Dockerfile Reference

```dockerfile
FROM node:22 AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM python:3.12
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend .
COPY --from=frontend /frontend/dist ./static
EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

## `.dockerignore`

The root `.dockerignore` excludes:

- `backend/v_env`
- `frontend/node_modules`
- `.git`
- Python caches
- mypy/ruff caches
- `.env`
- `.env.docker`

## Database Initialization in Deployments

On backend startup:

1. SQLAlchemy creates missing tables with `Base.metadata.create_all(bind=engine)`.
2. `seed_database()` checks table counts.
3. Seller CSV data is imported if `sellers` is empty.
4. Inventory CSV data is imported if `inventory` is empty.

This is convenient for demos. For production, replace this with migration-driven schema management and deliberate seed scripts.

## Production Checklist

Before public deployment:

- Add migrations, preferably Alembic.
- Remove the startup `DATABASE_URL` print.
- Restrict CORS origins.
- Replace plaintext/static key authentication.
- Use deployment-managed secrets.
- Add HTTPS at a reverse proxy/load balancer.
- Add structured logging and monitoring.
- Add tests and CI.
- Decide whether sample CSV seeding should run in production.
- Ensure `frontend/.env.production` points to the correct API origin before building.

## What Is Not Included

The repository does not currently include:

- `docker-compose.yml`
- Kubernetes manifests
- Heroku/Render/Railway/Fly.io configuration
- Nginx/Traefik/Caddy configuration
- SSL/TLS certificate management
- CI/CD workflow files
- Alembic migrations
- Health-check endpoint
