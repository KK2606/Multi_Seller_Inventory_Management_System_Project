# Multi-Seller Inventory Management System

<p align="center">
  <img src="frontend/images/homepage.png" alt="Multi-Seller Inventory Management System homepage" width="900">
</p>

<p align="center">
  <strong>FastAPI + React inventory management for sellers, products, and admin oversight.</strong>
</p>

<p align="center">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.12%20Docker-blue?style=for-the-badge&logo=python">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-0.136.3-009688?style=for-the-badge&logo=fastapi">
  <img alt="React" src="https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react&logoColor=111">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8.0.12-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-required-4169E1?style=for-the-badge&logo=postgresql">
  <img alt="Docker" src="https://img.shields.io/badge/Dockerfile-present-2496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-not%20specified-lightgrey?style=for-the-badge">
</p>

## Overview

Multi-Seller Inventory Management System is a full-stack inventory application with a FastAPI backend, a Vite React frontend, SQLAlchemy models, PostgreSQL persistence, CSV-based seed data, and a Docker build that serves the compiled frontend from the backend container.

The application supports seller registration, seller-key protected product management, public product browsing and search, and an admin-key protected dashboard that lists sellers with their product summaries. The codebase is organized as a route-service-schema-model backend and a route-driven React single-page app.

> **Production readiness note:** The project demonstrates a complete CRUD workflow, validation, authorization checks, rate limiting, and Docker packaging. It still uses plain admin/seller keys rather than hashed credentials, sessions, or JWT/OAuth, so public production deployment requires the security hardening called out in [SECURITY.md](SECURITY.md) and [ROADMAP.md](ROADMAP.md).

## Documentation

| Document | Purpose |
| --- | --- |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Backend/frontend architecture, request lifecycle, data flow, and diagrams |
| [API.md](API.md) | Verified REST endpoints, headers, query params, schemas, examples, and errors |
| [DATABASE.md](DATABASE.md) | SQLAlchemy schema, ER diagram, seed flow, constraints, and data notes |
| [SECURITY.md](SECURITY.md) | Current security controls, known risks, and hardening roadmap |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Local and Docker deployment workflows |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Setup, workflow, style, and contribution guidance |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Repository tree and folder responsibilities |
| [TECH_STACK.md](TECH_STACK.md) | Actual dependencies, versions, and usage status |

## Engineering Highlights

- **Layered FastAPI backend:** routers in `backend/routes`, business logic in `backend/services`, request/response models in `backend/schemas`, and SQLAlchemy tables in `backend/models`.
- **PostgreSQL-backed persistence:** SQLAlchemy connects through `DATABASE_URL`; startup creates tables and seeds sample data when tables are empty.
- **Seller ownership enforcement:** product and seller mutations authenticate a `SELLER-KEY` header and verify ownership before updates/deletes.
- **Admin dashboard flow:** admin access is protected by an `Admin-Key` header compared with the `ADMIN_KEY` environment variable.
- **Rate limiting:** SlowAPI middleware protects endpoints with per-route limits and a custom `429` JSON response.
- **React SPA:** React Router pages cover product browsing, seller portal, admin portal, seller signup, and update/create forms.
- **Centralized API client:** `frontend/src/services/api.jsx` uses Axios with `VITE_API_URL`, a 15-second timeout, cancellation helpers, and shared API error formatting.
- **Docker packaging:** a multi-stage Dockerfile builds the React frontend with Node 22 and serves it from the Python 3.12 FastAPI image.

## Features

### Current Backend Features

| Area | Implemented behavior |
| --- | --- |
| Inventory | List products, exact-match search, add products, update products, delete products |
| Sellers | Register sellers, load seller dashboard, update seller account, delete seller account |
| Admin | Load all sellers with product summaries and seller keys |
| Validation | Email validation, seller-key format validation, duplicate email/key checks, positive price, non-negative stock |
| Authorization | Seller-key authentication, admin-key authentication, product ownership checks, seller ownership checks |
| Rate limiting | Per-route SlowAPI limits with a custom `RATE_LIMIT_EXCEEDED` response |
| Seed data | Imports 9 sellers and 20 products from CSV when tables are empty |

### Current Frontend Features

| Route | Feature |
| --- | --- |
| `/` | Home page with navigation to products and admin portal |
| `/products` | Product table, product-name search, add/update/delete entry points |
| `/seller-portal` | Seller-key login, seller profile summary, owned product table, seller/product actions |
| `/admin-portal` | Admin-key dashboard, seller/product totals, local dashboard search, update/delete actions |
| `/new-seller-signup` | Seller registration form |
| `/add-product` | Seller-key protected product creation |
| `/update-product/:id` | Seller-key protected product update |
| `/update-seller/:sellerId` | Seller-key protected seller update |

### Planned / Work In Progress

The source contains TODOs for pagination, sorting, richer filtering, fuzzy search, image uploads, product variations, seller verification, product recovery/archiving, seller deactivation/recovery, stronger authentication, logging, and additional security middleware. See [ROADMAP.md](ROADMAP.md).

## Screenshots

<details open>
<summary><strong>Frontend</strong></summary>

### Home

![Home page](frontend/images/homepage.png)

### Products

![All products page](frontend/images/all_products_page.png)

### Seller Portal

![Seller dashboard](frontend/images/seller_dashboard.png)

### Admin Portal

![Admin dashboard](frontend/images/admin_dashboard.png)

### Add Product

![Add product form](frontend/images/add_product_form.png)

</details>

<details>
<summary><strong>Backend and Database Screenshots</strong></summary>

### Swagger Overview

![Swagger overview](backend/images/swagger_overview.png)

### Add Product Endpoint

![Add item endpoint](backend/images/add_item_endpoint.png)

### Inventory Table

![Inventory table](backend/images/inventory_table.png)

### Seller Table

![Seller table](backend/images/seller_table.png)

</details>

## Architecture Overview

```mermaid
flowchart LR
    User["Browser user"] --> SPA["React SPA<br/>frontend/src"]
    SPA -->|Axios<br/>VITE_API_URL| API["FastAPI app<br/>backend/main.py"]
    API --> Routers["Routers<br/>admin_routes.py<br/>inventory_routes.py<br/>seller_routes.py"]
    Routers --> Services["Services<br/>auth, validators,<br/>inventory, seller, admin"]
    Services --> Models["SQLAlchemy models<br/>Seller_database<br/>Inventory_database"]
    Models --> DB[("PostgreSQL")]
    API --> Limiter["SlowAPI rate limiter"]
    API --> CORS["CORS middleware"]
    API -. Docker only .-> Static["StaticFiles<br/>/app/static"]
```

```mermaid
sequenceDiagram
    participant Client as React/Axios Client
    participant FastAPI as FastAPI Route
    participant Limiter as SlowAPI
    participant Service as Service Layer
    participant DB as PostgreSQL

    Client->>FastAPI: HTTP request
    FastAPI->>Limiter: apply endpoint rate limit
    Limiter-->>FastAPI: allow or 429
    FastAPI->>FastAPI: validate query/body/header with FastAPI + Pydantic
    FastAPI->>Service: call service function
    Service->>DB: SQLAlchemy query/mutation
    DB-->>Service: ORM rows/results
    Service-->>FastAPI: dict/model/string or HTTPException
    FastAPI-->>Client: JSON response
```

## Database Overview

```mermaid
erDiagram
    SELLERS ||--o{ INVENTORY : owns
    SELLERS {
        int seller_id PK
        string seller_name
        string seller_email UK
        string seller_key UK
    }
    INVENTORY {
        int item_id PK
        string item_name
        string item_description
        string item_category
        float item_price
        int item_stock_qty
        boolean in_stock
        int seller_id FK
    }
```

The backend defines two SQLAlchemy models:

- `Seller_database` maps to the `sellers` table.
- `Inventory_database` maps to the `inventory` table and references `sellers.seller_id`.

No Alembic migration setup is present. `backend/main.py` calls `Base.metadata.create_all(bind=engine)` at startup.

## Tech Stack

| Layer | Technologies actually present |
| --- | --- |
| Backend API | FastAPI `0.136.3`, Starlette, Uvicorn `0.48.0` |
| Backend data | SQLAlchemy `2.0.50`, PostgreSQL via `psycopg2` `2.9.12` |
| Backend validation/config | Pydantic `2.13.4`, `email-validator`, `python-dotenv` |
| Backend protection | SlowAPI `0.1.10` and `limits` |
| Frontend | React `19.2.6`, React DOM, Vite `8.0.12`, React Router DOM `7.16.0` |
| Frontend API/UI | Axios `1.16.1`, React Hot Toast `2.6.0`, CSS in `frontend/src/index.css` |
| Tooling | ESLint `10.3.0`, Docker multi-stage build |

Installed but not currently used in source: Bootstrap, Redux Toolkit, and React Redux.

## Project Structure

```mermaid
flowchart TB
    Root["Inventory_System_v2"]
    Root --> Backend["backend"]
    Root --> Frontend["frontend"]
    Root --> Docker["Dockerfile"]
    Root --> Docs["Markdown documentation"]

    Backend --> BMain["main.py"]
    Backend --> BRoutes["routes"]
    Backend --> BServices["services"]
    Backend --> BSchemas["schemas"]
    Backend --> BModels["models"]
    Backend --> BDB["db"]
    Backend --> BScripts["scripts"]
    Backend --> BSample["sample_data"]

    Frontend --> FSrc["src"]
    Frontend --> FPublic["public"]
    Frontend --> FImages["images"]
    FSrc --> FPages["pages"]
    FSrc --> FComponents["components"]
    FSrc --> FContext["context"]
    FSrc --> FServices["services"]
```

```text
Inventory_System_v2/
|-- backend/
|   |-- main.py
|   |-- config.py
|   |-- requirements.txt
|   |-- core/rate_limiter.py
|   |-- db/db_config.py
|   |-- models/
|   |-- routes/
|   |-- schemas/
|   |-- services/
|   |-- scripts/
|   |-- sample_data/
|   `-- images/
|-- frontend/
|   |-- package.json
|   |-- vite.config.js
|   |-- eslint.config.js
|   |-- index.html
|   |-- public/
|   |-- images/
|   `-- src/
|       |-- App.jsx
|       |-- main.jsx
|       |-- index.css
|       |-- components/
|       |-- context/
|       |-- pages/
|       `-- services/
|-- Dockerfile
|-- .dockerignore
`-- README.md and companion documentation
```

## Installation

### Prerequisites

- Python 3.10+ for local development (`Dockerfile` uses Python 3.12)
- PostgreSQL database
- Node.js/npm for the frontend (`Dockerfile` uses Node 22)
- Docker, if using the container workflow

### Backend Setup

Run backend commands from `backend/` so imports such as `from db.db_config import ...` resolve correctly.

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

Create the PostgreSQL database referenced by `DATABASE_URL`, then start the API:

```powershell
uvicorn main:app --reload
```

Backend URLs:

- API root host: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

### Frontend Setup

Run frontend commands from `frontend/`.

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

Vite usually serves the frontend at `http://localhost:5173`.

## Configuration

| Variable | Required | Used by | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | `backend/db/db_config.py` | PostgreSQL SQLAlchemy connection string |
| `ADMIN_KEY` | Yes | `backend/config.py`, `services/auth_services.py` | Expected value for the `Admin-Key` request header |
| `RUNNING_IN_DOCKER` | Docker frontend serving only | `backend/main.py` | When set to `true`, mounts `static/` at `/` |
| `PORT` | Optional in Docker | `Dockerfile` CMD | Overrides Uvicorn port; defaults to `8000` |
| `VITE_API_URL` | Yes for frontend | `frontend/src/services/api.jsx` | Axios base URL for API calls |

## Usage

### Seller Workflow

1. Register a seller at `/new-seller-signup`.
2. Open `/seller-portal`.
3. Enter the seller key.
4. View the seller profile and owned products.
5. Add, update, or delete products.
6. Delete the seller only after all owned products are removed.

### Admin Workflow

1. Set `ADMIN_KEY` in `backend/.env`.
2. Open `/admin-portal`.
3. Enter the admin key.
4. View all sellers and product summaries.
5. Use product/seller actions, which still call seller-key protected backend endpoints.

### Product Browsing Workflow

1. Open `/products`.
2. Browse products from `/inventory/show-all-products`.
3. Search by exact product name through `/inventory/search-products?ITEM_NAME=...`.
4. Provide a seller key for update/delete actions.

## API Overview

| Method | Endpoint | Auth | Rate limit |
| --- | --- | --- | --- |
| `GET` | `/inventory/show-all-products` | Public | `50/minute` |
| `GET` | `/inventory/search-products` | Public | `50/minute` |
| `POST` | `/inventory/add-product` | `SELLER-KEY` | `20/minute` |
| `PUT` | `/inventory/update-product` | `SELLER-KEY` | `20/minute` |
| `DELETE` | `/inventory/delete-product` | `SELLER-KEY` | `20/minute` |
| `POST` | `/seller/new-seller-signup` | Public | `3/minute` |
| `GET` | `/seller/seller-dashboard` | `SELLER-KEY` | `5/minute` |
| `PUT` | `/seller/update-seller` | `SELLER-KEY` | `5/minute` |
| `DELETE` | `/seller/delete-seller` | `SELLER-KEY` | `5/minute` |
| `GET` | `/admin/admin_dashboard` | `Admin-Key` | `5/minute` |

See [API.md](API.md) for request fields, response shapes, examples, and implementation notes.

## Security Overview

Current controls:

- Seller keys are validated as 4-8 alphanumeric characters on seller create/update.
- Seller emails use Pydantic `EmailStr`.
- Duplicate seller email and seller key checks are performed in service logic.
- Seller mutations authenticate `SELLER-KEY`.
- Admin dashboard authenticates `Admin-Key`.
- Product and seller ownership checks return `403` when a valid seller attempts to modify another seller's resources.
- SlowAPI returns `429` after configured endpoint limits.

Important limitations:

- Seller keys are stored in plaintext.
- Admin auth is a static environment key.
- No JWT, OAuth, password hashing, refresh-token, session, or role model exists.
- CORS currently allows all origins.
- The database URL is printed during backend import in `backend/db/db_config.py`.

See [SECURITY.md](SECURITY.md) for the hardening checklist.

## Deployment

The root `Dockerfile` builds the frontend and backend into one image:

```powershell
docker build -t inventory-system-v2 .
docker run --rm -p 8000:8000 --env-file backend/.env.docker inventory-system-v2
```

For the built React app to be served from FastAPI, the runtime environment must include:

```env
RUNNING_IN_DOCKER=true
```

The container expects PostgreSQL to be reachable through `DATABASE_URL`. No `docker-compose.yml`, managed cloud configuration, reverse proxy, HTTPS configuration, or migration runner is present in this repository.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full list. The highest-impact planned items are:

- Replace static/plain seller/admin keys with production authentication.
- Add Alembic migrations.
- Add automated tests and CI.
- Align API response schemas with frontend table expectations.
- Restrict CORS and remove sensitive startup prints.
- Add pagination, sorting, filtering, and fuzzy search.

## FAQ

<details>
<summary><strong>Does the backend create database tables automatically?</strong></summary>

Yes. `backend/main.py` calls `Base.metadata.create_all(bind=engine)` at startup. This creates tables but does not provide versioned migrations.
</details>

<details>
<summary><strong>Does the app seed sample data?</strong></summary>

Yes. `seed_database()` imports CSV data only when the `sellers` or `inventory` table is empty. The sample files contain 9 sellers and 20 inventory products.
</details>

<details>
<summary><strong>Where does the frontend get the API URL?</strong></summary>

`frontend/src/services/api.jsx` reads `import.meta.env.VITE_API_URL`. Set it in `frontend/.env` during local development.
</details>

<details>
<summary><strong>Is this ready for public production traffic?</strong></summary>

Not without hardening. The current implementation is appropriate as a portfolio/demo full-stack project, but production deployment should add secure credential handling, migrations, tests, restricted CORS, HTTPS/reverse proxy configuration, and structured logging.
</details>

## Contributing

Contributions should preserve the current layered architecture:

- Add FastAPI endpoints in `backend/routes`.
- Keep business rules in `backend/services`.
- Add or update Pydantic schemas in `backend/schemas`.
- Update SQLAlchemy tables in `backend/models` and document schema changes.
- Add React pages/components under `frontend/src`.
- Update documentation whenever API, security, deployment, or database behavior changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

## License

No `LICENSE` file is present in this repository. Until a license is added, assume the project is not open for reuse beyond the permissions granted by the repository owner.

## Author

Author information is not specified in repository metadata. The existing README identifies this as a portfolio project for demonstrating full-stack web development with FastAPI, React, PostgreSQL, SQLAlchemy, REST APIs, and Docker.
