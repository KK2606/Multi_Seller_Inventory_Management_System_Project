# Interview Guide

Use this guide to explain the project accurately in interviews, portfolio reviews, and recruiter screens.

## Elevator Pitch

Multi-Seller Inventory Management System is a full-stack inventory app built with FastAPI, React, PostgreSQL, SQLAlchemy, and Docker. Sellers can register, authenticate with a seller key, manage only their own products, and view a seller dashboard. Admins can use a separate admin key to view all sellers and product summaries. The project demonstrates layered backend design, RESTful CRUD endpoints, database modeling, frontend routing, form workflows, rate limiting, validation, and Docker packaging.

## What This Project Demonstrates

| Skill | Evidence in the repo |
| --- | --- |
| REST API design | FastAPI routers in `backend/routes` |
| Layered backend architecture | Routes delegate to services, services use validators/models |
| Database modeling | `sellers` and `inventory` SQLAlchemy models with a foreign key |
| Data validation | Pydantic schemas and service-level validation |
| Authorization | Seller/admin key checks and ownership validation |
| Frontend integration | React pages call FastAPI through Axios |
| State management | Seller key stored in React Context |
| UX workflows | Product, seller, and admin pages with loading/error/empty states |
| Deployment basics | Docker multi-stage build for frontend + backend |
| Documentation | Markdown docs with verified endpoints, schema, diagrams, and security notes |

## Architecture Talking Points

### Backend

- `backend/main.py` is the FastAPI entry point.
- Routers live in `backend/routes`.
- Business logic lives in `backend/services`.
- Pydantic schemas live in `backend/schemas`.
- SQLAlchemy models live in `backend/models`.
- Database sessions are provided through `Depends(get_db)`.
- Rate limits are applied with SlowAPI decorators on route handlers.

### Frontend

- `frontend/src/App.jsx` owns React Router route definitions.
- `frontend/src/services/api.jsx` centralizes Axios configuration and error helpers.
- `frontend/src/context/Seller_Context.jsx` stores the seller key.
- Pages implement route-level workflows.
- Components provide reusable forms, tables, search input, and page states.

### Data Model

- `sellers` stores seller identity fields and seller keys.
- `inventory` stores product details and references `sellers.seller_id`.
- A seller can own many products.
- Seller deletion is blocked while products exist.

## Demo Script

1. Start backend and frontend.
2. Open the products page and show public product listing.
3. Search for a product by exact product name.
4. Register a new seller.
5. Use the seller key in the seller portal.
6. Add a product for that seller.
7. Update or delete an owned product.
8. Open admin portal and load all sellers with the admin key.
9. Show the Swagger UI at `/docs`.

## Strong Answers to Common Questions

### Why FastAPI?

FastAPI gives automatic OpenAPI documentation, Pydantic validation, dependency injection, and a clean route structure. In this project, those features are used for request validation, response models, database session injection, and Swagger documentation.

### How is authorization handled?

The project uses header-based keys. Seller endpoints require `SELLER-KEY`, which is matched against the `sellers` table. Admin dashboard requires `Admin-Key`, which is compared to the `ADMIN_KEY` environment variable. Product and seller mutations also verify ownership before allowing updates or deletes.

### How does the database initialize?

On startup, `backend/main.py` calls `Base.metadata.create_all(bind=engine)` to create missing tables. It then calls `seed_database()`, which imports CSV data only when the sellers or inventory table is empty.

### What would you improve before production?

I would replace plaintext seller keys and the static admin key with a real authentication system, add Alembic migrations, add automated tests and CI, restrict CORS, remove sensitive startup logging, add structured logs, and align a few response models with frontend expectations.

### What are the main tradeoffs?

The current implementation favors clarity and portfolio readability over production security and operational maturity. For example, `create_all()` and CSV seeding are simple for demos, but migrations and deliberate seed processes would be better for production. Header keys are easy to understand, but hashed credentials or token-based auth would be safer.

### How is the frontend organized?

The frontend is route-driven. `App.jsx` declares pages, each page owns its API calls and workflow state, and shared UI pieces live in `components`. Axios configuration and API error parsing are centralized in `services/api.jsx`.

### How are errors handled?

Backend services raise `HTTPException` for invalid auth, forbidden ownership changes, duplicates, validation failures, and missing rows. SlowAPI has a custom `429` response. The frontend formats API errors with `getApiErrorMessage()` and shows user-facing toasts.

## Technical Deep Dive Questions

### What happens when a seller updates a product?

1. The frontend sends `PUT /inventory/update-product?ITEM_ID=...` with `SELLER-KEY`.
2. FastAPI validates the body against `Update_Inventory_Schema`.
3. `authenticate_seller()` finds the seller by key.
4. The service loads the product by item ID.
5. `validate_item_ownership()` checks seller ownership.
6. Non-null fields are updated.
7. Price and stock are validated when provided.
8. SQLAlchemy commits the transaction.

### What happens when a seller is deleted?

1. The request includes `DEL_ID` and `SELLER-KEY`.
2. The seller key is authenticated.
3. The target seller is loaded by ID.
4. Ownership is checked.
5. The service checks for existing inventory items.
6. If products exist, it returns `400`.
7. Otherwise, it deletes the seller and commits.

### How does rate limiting work?

`backend/core/rate_limiter.py` creates a SlowAPI `Limiter` using `get_remote_address`. `backend/main.py` attaches it to `app.state.limiter`, registers a custom `RateLimitExceeded` handler, and adds `SlowAPIMiddleware`. Routes use decorators such as `@limiter.limit("5/minute")`.

### Why do some update bodies send `null`?

The update schemas declare nullable fields such as `update_item_name: str | None` without default values. That means clients should send all update keys and use `null` for fields that should remain unchanged. The service updates only non-null values.

## Honest Limitations to Mention

- Authentication is key-based and not production-grade.
- Seller keys are stored in plaintext.
- Admin access uses one static key.
- No migrations exist.
- No tests exist.
- CORS allows all origins.
- Some response models filter fields that services return.
- `App.css`, Bootstrap, Redux Toolkit, and React Redux are present but not actively used by the current source.

Naming these limitations is a strength: it shows you can evaluate your own system like an engineer, not just demo the happy path.

## Best Files to Walk Through

| Topic | File |
| --- | --- |
| App bootstrap | `backend/main.py` |
| Database config | `backend/db/db_config.py` |
| Product routes | `backend/routes/inventory_routes.py` |
| Product logic | `backend/services/inventory_services.py` |
| Seller logic | `backend/services/seller_services.py` |
| Auth helpers | `backend/services/auth_services.py` |
| Database models | `backend/models/db_seller.py`, `backend/models/db_inventory.py` |
| React routes | `frontend/src/App.jsx` |
| Axios client | `frontend/src/services/api.jsx` |
| Seller portal | `frontend/src/pages/Seller_Portal.jsx` |
| Admin portal | `frontend/src/pages/Admin_Portal.jsx` |

## Portfolio Positioning

This project is strongest as a backend-heavy full-stack portfolio project. Lead with:

- Clear API and database design.
- Ownership-based authorization.
- Full CRUD workflows.
- React integration with real forms and dashboards.
- Docker packaging.
- Honest production-hardening roadmap.

Avoid claiming:

- Enterprise-ready security.
- Complete test coverage.
- CI/CD.
- Migration support.
- JWT/OAuth authentication.
- Redux-based state management.

Those are not implemented in the current codebase.
