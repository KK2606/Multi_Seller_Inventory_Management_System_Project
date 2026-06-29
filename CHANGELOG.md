# Changelog

This repository does not contain tagged releases. This changelog documents the current project state and documentation changes.

## [Unreleased]

### Added

- Production-quality documentation set:
  - `README.md`
  - `ARCHITECTURE.md`
  - `API.md`
  - `DATABASE.md`
  - `SECURITY.md`
  - `DEPLOYMENT.md`
  - `CONTRIBUTING.md`
  - `ROADMAP.md`
  - `CHANGELOG.md`
  - `PROJECT_STRUCTURE.md`
  - `TECH_STACK.md`
  - `INTERVIEW_GUIDE.md`
- Mermaid diagrams for system architecture, component architecture, request lifecycle, authentication flow, database ER model, deployment, and folder hierarchy.
- Verified API endpoint documentation based on `backend/routes`.
- Verified database documentation based on `backend/models`, `backend/db/db_config.py`, and CSV seed scripts.
- Security documentation separating implemented controls from planned hardening.

### Current Implementation Snapshot

- FastAPI backend with admin, inventory, and seller routers.
- SQLAlchemy models for `sellers` and `inventory`.
- PostgreSQL connection through `DATABASE_URL`.
- Startup table creation through `Base.metadata.create_all(bind=engine)`.
- CSV seeding when tables are empty.
- Key-based seller/admin authentication.
- Service-level product and seller ownership checks.
- SlowAPI route rate limits.
- React/Vite frontend with product, seller, admin, signup, add, and update pages.
- Docker multi-stage build that compiles the frontend and serves it from the backend image when `RUNNING_IN_DOCKER=true`.

### Known Gaps

- No Alembic migrations.
- No automated tests.
- No CI/CD configuration.
- No JWT/OAuth/session/password authentication.
- Seller keys are stored in plaintext.
- CORS allows all origins.
- `backend/db/db_config.py` prints the database URL at startup.
- Some response models filter fields returned by services.

## Release Notes Policy

When versions are introduced, use this format:

```markdown
## [x.y.z] - YYYY-MM-DD

### Added
### Changed
### Fixed
### Security
### Removed
```
