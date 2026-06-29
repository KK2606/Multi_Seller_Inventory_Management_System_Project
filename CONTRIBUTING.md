# Contributing

Thank you for improving this project. This repository is a full-stack FastAPI + React app, so contributions should preserve the current separation between backend routes/services/models/schemas and frontend pages/components/services.

## Local Setup

### Backend

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

### Frontend

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```powershell
npm run dev
```

## Development Workflow

1. Create a focused branch for the change.
2. Read the related backend and frontend files before editing.
3. Keep changes scoped to the feature or bug.
4. Update documentation when API, database, security, deployment, or configuration behavior changes.
5. Run the relevant validation commands before opening a pull request.

## Architecture Rules

### Backend

| Change type | Preferred location |
| --- | --- |
| New endpoint path/method | `backend/routes/*.py` |
| Business logic | `backend/services/*.py` |
| Request/response validation | `backend/schemas/*.py` |
| Database table shape | `backend/models/*.py` |
| Shared validators | `backend/services/validators.py` |
| Authentication helpers | `backend/services/auth_services.py` |
| Rate-limit behavior | `backend/core/rate_limiter.py` |

Do not put database-heavy business logic directly into route handlers if it belongs in a service.

### Frontend

| Change type | Preferred location |
| --- | --- |
| Route registration | `frontend/src/App.jsx` |
| Page-level workflow | `frontend/src/pages/*.jsx` |
| Reusable UI | `frontend/src/components/*.jsx` |
| API calls/helpers | `frontend/src/services/api.jsx` |
| Shared seller key state | `frontend/src/context/*` |
| Global styling | `frontend/src/index.css` |

## Coding Guidelines

- Follow the existing naming style, including current file names such as `Seller_Portal.jsx` and schema class names such as `Add_Seller_Schema`.
- Keep backend validation duplicated only where it has a purpose: frontend validation improves UX, backend validation enforces security and data integrity.
- Use SQLAlchemy ORM patterns already present in the services.
- Return accurate FastAPI response models when adding or changing endpoints.
- Keep React components focused and reusable where existing patterns support it.
- Do not commit real secrets in `.env`, `.env.docker`, or frontend env files.

## Validation Commands

Backend:

```powershell
cd backend
python -m compileall .
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

Docker:

```powershell
docker build -t inventory-system-v2 .
```

## Tests

Automated tests are not currently present in this repository. Adding tests is a planned improvement. Recommended first test areas:

- Seller signup validation and duplicate checks.
- Seller authentication and ownership checks.
- Product create/update/delete validation.
- Admin dashboard authentication.
- Rate-limit response behavior.
- Frontend form validation and API error handling.

## Documentation Updates

Update these files when behavior changes:

| Change | Docs to update |
| --- | --- |
| Endpoint, request body, response body, headers | `API.md`, `README.md` |
| Table/column/seed behavior | `DATABASE.md`, `PROJECT_STRUCTURE.md` if files move |
| Auth, authorization, rate limits, CORS | `SECURITY.md`, `API.md` |
| Docker/env/deployment behavior | `DEPLOYMENT.md`, `README.md` |
| Dependencies | `TECH_STACK.md`, `README.md` |


## Pull Request Checklist

- The change is scoped and easy to review.
- API behavior is documented if changed.
- Database changes are documented if changed.
- Security impact has been considered.
- Frontend forms and API calls match backend schemas.
- `npm run lint` and `npm run build` pass for frontend changes.
- Backend files compile for backend changes.
- No real secrets are included.

## Current Contribution Priorities

- Add automated tests.
- Add migration tooling.
- Harden authentication.
- Align API response schemas with frontend expectations.
- Remove sensitive startup logging.
- Improve production deployment configuration.
