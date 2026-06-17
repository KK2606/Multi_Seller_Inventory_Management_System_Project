# Multi-Seller Inventory Management System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136.3-green?style=flat-square&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-supported-blue?style=flat-square&logo=postgresql)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0.50-red?style=flat-square&logo=sqlalchemy)
![Pydantic](https://img.shields.io/badge/Pydantic-2.13.4-red?style=flat-square&logo=pydantic)
![React](https://img.shields.io/badge/React-19.2.6-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0.12-purple?style=flat-square&logo=vite)
![Axios](https://img.shields.io/badge/Axios-1.16.1-green?style=flat-square&logo=axios)
![React Hot Toast](https://img.shields.io/badge/React%20Hot%20Toast-2.6.0-blue?style=flat-square&logo=react-hot-toast)
![React Router](https://img.shields.io/badge/React%20Router-7.16.0-blue?style=flat-square&logo=react-router)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-blue?style=flat-square&logo=javascript)
![Docker](https://img.shields.io/badge/Dockerfile-present-blue?style=flat-square&logo=docker)

## Project Overview

This repository contains a FastAPI backend and a Vite React frontend for a multi-seller inventory management system. Sellers register with a business name, email address, and seller key, then use that key to manage their own products. Admin access uses a separate admin key to load all sellers and their product lists.

The backend persists data in PostgreSQL through SQLAlchemy models, validates request bodies with Pydantic schemas, applies SlowAPI rate limits on route handlers, enables CORS for all origins, and exposes FastAPI's default Swagger UI. The frontend is a React single-page app with pages for products, seller registration, seller dashboard, admin dashboard, and create/update forms.

## Features

### Seller Features

- Register a seller with `add_seller_name`, `add_seller_email`, and `add_seller_key`.
- Load a seller dashboard with the `SELLER-KEY` request header.
- View the authenticated seller profile and owned products.
- Add, update, and delete products owned by the authenticated seller.
- Update seller name, email, or key.
- Delete a seller profile only after all owned products have been deleted.

### Admin Features

- Load all sellers and their products with the `Admin-Key` request header.
- View seller IDs, names, emails, seller keys, and product summaries.
- See dashboard totals for sellers, products, and visible search results in the frontend.
- Search loaded dashboard data in the frontend.
- Use seller-key-protected product and seller actions from the admin portal.

### Inventory Features

- List all products.
- Search products by exact query-parameter matches.
- Add products with name, description, category, price, and stock quantity.
- Update product fields individually by sending nullable update fields.
- Delete products by item ID.
- Automatically set `in_stock` from stock quantity when products are added or updated.
- Validate that product price is greater than zero and stock quantity is not negative.

### Frontend Features

- React Router routes for home, products, seller portal, admin portal, seller signup, product creation, product update, and seller update.
- Axios API client configured with `http://127.0.0.1:8000`.
- React Hot Toast notifications for user actions and API errors.
- Seller key state stored with React Context.
- Responsive tables, form components, loading states, empty states, and error states.

## Technology Stack

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- PostgreSQL through `psycopg2`
- Pydantic and `email-validator`
- `python-dotenv`
- SlowAPI

### Frontend

- React
- Vite
- React Router DOM
- Axios
- React Hot Toast
- React Context for seller-key state

`package.json` also includes Bootstrap, Redux Toolkit, and React Redux dependencies, but the current frontend source does not import Bootstrap or configure a Redux store.

## System Architecture

### Backend

The backend is organized around FastAPI route modules, service modules, Pydantic schemas, SQLAlchemy models, and a shared database session dependency.

```text
FastAPI app (backend/main.py)
  -> routers (backend/routes/)
  -> services (backend/services/)
  -> schemas (backend/schemas/)
  -> models (backend/models/)
  -> PostgreSQL connection/session (backend/db/db_config.py)
```

At startup, `backend/main.py` creates database tables with `Base.metadata.create_all(bind=engine)`, registers the admin, inventory, and seller routers, installs SlowAPI middleware, enables CORS, and mounts `StaticFiles(directory="static", html=True)` at `/` for the Docker-built frontend.

### Frontend

The frontend is a Vite React app. `frontend/src/App.jsx` defines the browser routes, `frontend/src/services/api.jsx` centralizes Axios behavior, `frontend/src/context/Seller_Context.jsx` stores the seller key, and page/components files implement the UI workflows.

## Database Design

### `sellers`

| Column         | Type    | Notes                |
| -------------- | ------- | -------------------- |
| `seller_id`    | Integer | Primary key, indexed |
| `seller_name`  | String  | Required             |
| `seller_email` | String  | Required, unique     |
| `seller_key`   | String  | Required, unique     |

### `inventory`

| Column             | Type    | Notes                              |
| ------------------ | ------- | ---------------------------------- |
| `item_id`          | Integer | Primary key, indexed               |
| `item_name`        | String  | Required                           |
| `item_description` | String  | Required                           |
| `item_category`    | String  | Required                           |
| `item_price`       | Float   | Required                           |
| `item_stock_qty`   | Integer | Required, default `0`              |
| `in_stock`         | Boolean | Required, default `False`          |
| `seller_id`        | Integer | Foreign key to `sellers.seller_id` |

One seller can own multiple inventory items through `inventory.seller_id`. The current service logic blocks seller deletion when that seller still owns inventory items; no cascade delete is configured in the SQLAlchemy model.

## Environment Configuration

Backend configuration is loaded from environment variables with `python-dotenv`.

| Variable       | Used by                                                     | Purpose                                                           |
| -------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL` | `backend/db/db_config.py`                                   | PostgreSQL connection string passed to SQLAlchemy `create_engine` |
| `ADMIN_KEY`    | `backend/config.py` and `backend/services/auth_services.py` | Value expected in the `Admin-Key` header                          |

`backend/.env.example` contains the expected variable names. The frontend currently does not read a Vite environment variable for the API URL; Axios uses `http://127.0.0.1:8000` directly.

## API Endpoints

FastAPI's default API documentation is available at `/docs` when the backend is running.

| Method   | Route                          | Query Parameters                                                                              | Body                                                                                                           | Authentication      | Rate Limit  |
| -------- | ------------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------- | ----------- |
| `GET`    | `/inventory/show-all-products` | None                                                                                          | None                                                                                                           | None                | `50/minute` |
| `GET`    | `/inventory/search-products`   | `ITEM_ID`, `ITEM_NAME`, `ITEM_CATEGORY`, `ITEM_PRICE`, `IN_STOCK`, `SELLER_ID`, `SELLER_NAME` | None                                                                                                           | None                | `50/minute` |
| `POST`   | `/inventory/add-product`       | None                                                                                          | `add_item_name`, `add_item_description`, `add_item_category`, `add_item_price`, `add_stock_qty`                | `SELLER-KEY` header | `20/minute` |
| `PUT`    | `/inventory/update-product`    | `ITEM_ID`                                                                                     | `update_item_name`, `update_item_description`, `update_item_category`, `update_item_price`, `update_stock_qty` | `SELLER-KEY` header | `20/minute` |
| `DELETE` | `/inventory/delete-product`    | `DEL_ID`                                                                                      | None                                                                                                           | `SELLER-KEY` header | `20/minute` |
| `POST`   | `/seller/new-seller-signup`    | None                                                                                          | `add_seller_name`, `add_seller_email`, `add_seller_key`                                                        | None                | `3/minute`  |
| `GET`    | `/seller/seller-dashboard`     | None                                                                                          | None                                                                                                           | `SELLER-KEY` header | `5/minute`  |
| `PUT`    | `/seller/update-seller`        | `SELLER_ID`                                                                                   | `update_seller_name`, `update_seller_email`, `update_seller_key`                                               | `SELLER-KEY` header | `5/minute`  |
| `DELETE` | `/seller/delete-seller`        | `DEL_ID`                                                                                      | None                                                                                                           | `SELLER-KEY` header | `5/minute`  |
| `GET`    | `/admin/admin_dashboard`       | None                                                                                          | None                                                                                                           | `Admin-Key` header  | `5/minute`  |

Search filters are exact matches in the backend service. If no product matches a search, the service raises `404` with `detail="Item not found"`.

## Validation and Security Notes

- Seller authentication checks the `SELLER-KEY` header against `sellers.seller_key`.
- Admin authentication checks the `Admin-Key` header against the `ADMIN_KEY` environment variable.
- Seller keys are validated by Pydantic on create/update as 4 to 8 alphanumeric characters.
- Seller emails are validated with Pydantic `EmailStr`.
- Duplicate seller email and seller key checks are performed in service logic.
- Product ownership is checked before product update/delete.
- Seller ownership is checked before seller update/delete.
- Product price must be greater than zero.
- Product stock quantity must be zero or greater.
- Rate-limited requests return HTTP `429` with `error: "RATE_LIMIT_EXCEEDED"`.
- CORS is configured with `allow_origins=["*"]`, `allow_methods=["*"]`, and `allow_headers=["*"]`.
- Seller keys and the admin key are plain key values; the current backend does not implement passwords, JWTs, hashing, or sessions.

## Frontend Routes

| Route                      | Component        | Purpose                                                                          |
| -------------------------- | ---------------- | -------------------------------------------------------------------------------- |
| `/`                        | `Home`           | Landing page for the app                                                         |
| `/products`                | `Products`       | Browse products, search by product name, and start product update/delete actions |
| `/seller-portal`           | `Seller_Portal`  | Load seller dashboard with a seller key and manage owned products/profile        |
| `/admin-portal`            | `Admin_Portal`   | Load all sellers and product summaries with the admin key                        |
| `/add-product`             | `Add_Product`    | Create a product with a seller key                                               |
| `/update-product/:id`      | `Update_Product` | Update a product by item ID with a seller key                                    |
| `/update-seller/:sellerId` | `Update_Seller`  | Update seller fields by seller ID with the current seller key                    |
| `/new-seller-signup`       | `New_Seller`     | Create a new seller                                                              |

## Project Structure

```text
Inventory_System_v2/
|-- .dockerignore
|-- Dockerfile
|-- README.md
|-- backend/
|   |-- .env.example
|   |-- config.py
|   |-- main.py
|   |-- requirements.txt
|   |-- core/
|   |   `-- rate_limiter.py
|   |-- db/
|   |   `-- db_config.py
|   |-- models/
|   |   |-- db_inventory.py
|   |   `-- db_seller.py
|   |-- routes/
|   |   |-- admin_routes.py
|   |   |-- inventory_routes.py
|   |   `-- seller_routes.py
|   |-- schemas/
|   |   |-- admin_schema.py
|   |   |-- inventory_schema.py
|   |   `-- seller_schema.py
|   |-- services/
|   |   |-- admin_service.py
|   |   |-- auth_services.py
|   |   |-- inventory_services.py
|   |   |-- seller_services.py
|   |   `-- validators.py
|   |-- scripts/
|   |   |-- seed_database.py
|   |   |-- csvdata_inventory_import.py
|   |   `-- csvdata_seller_import.py
|   |-- sample_data/
|   |   |-- _inventory_data.csv
|   |   `-- _seller_data.csv
|   `-- images/
`-- frontend/
    |-- index.html
    |-- package.json
    |-- package-lock.json
    |-- vite.config.js
    |-- eslint.config.js
    |-- public/
    |-- images/
    `-- src/
        |-- App.jsx
        |-- App.css
        |-- index.css
        |-- main.jsx
        |-- assets/
        |-- components/
        |-- context/
        |-- pages/
        `-- services/
```

## Installation

### Prerequisites

- Python 3.10 or newer for local backend development
- PostgreSQL
- Node.js and npm for local frontend development
- Docker, if using the Docker workflow

### Backend Setup

Run backend commands from the `backend` directory so imports such as `from db.db_config import ...` resolve correctly.

```bash
cd backend
python -m venv v_env
```

Activate the virtual environment.

```powershell
.\v_env\Scripts\Activate.ps1
```

Install Python dependencies.

```bash
pip install -r requirements.txt
```

Create a backend environment file from the example and set values for your PostgreSQL database and admin key.

```powershell
Copy-Item .env.example .env
```

Example values:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
ADMIN_KEY=your-admin-key
```

Create the PostgreSQL database named in `DATABASE_URL`. The FastAPI app creates the `sellers` and `inventory` tables on startup and will automatically fill them with data from `sample_data/_seller_data.csv` and `sample_data/_inventory_data.csv` when backend is started.

Start the backend.

```bash
uvicorn main:app --reload
```

The backend runs at `http://127.0.0.1:8000`.

### Frontend Setup

Run frontend commands from the `frontend` directory.

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs at `http://localhost:5173` by default. The frontend API client calls `http://127.0.0.1:8000`.

Available frontend scripts:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Docker Workflow

The repository includes a root `Dockerfile` and `.dockerignore`.

The Dockerfile:

1. Uses `node:22` to install frontend dependencies and run `npm run build`.
2. Uses `python:3.12` for the backend image.
3. Installs `backend/requirements.txt`.
4. Copies backend source into `/app`.
5. Copies the built React files from `/frontend/dist` into `/app/static`.
6. Starts Uvicorn with `main:app` on `0.0.0.0:8000`.

Build and run from the repository root.

```bash
docker build -t inventory-system-v2 .
docker run --rm -p 8000:8000 --env-file backend/.env inventory-system-v2
```

The container serves the API and built frontend at `http://localhost:8000`. Runtime environment variables must include `DATABASE_URL` and `ADMIN_KEY`.

The `.dockerignore` excludes local virtual environments, `node_modules`, `.git`, caches, and `.env` files from the build context. No `docker-compose.yml` or platform-specific deployment configuration is present in this repository.

## Usage Guide

### Admin Workflow

1. Start the backend with `DATABASE_URL` and `ADMIN_KEY` configured.
2. Open `/admin-portal` in the frontend.
3. Enter the admin key configured in `backend/.env`.
4. Load all sellers and their product summaries.
5. Search the loaded dashboard data if needed.
6. Use update/delete actions. Product and seller mutation requests still use seller-key-protected backend endpoints.

### Seller Workflow

1. Open `/new-seller-signup` to create a seller with a unique email and seller key.
2. Open `/seller-portal`.
3. Enter the seller key.
4. View the seller profile and owned products.
5. Add, update, or delete owned products.
6. Update the seller profile if needed.
7. Delete the seller profile only after deleting all owned products.

### Product Browsing Workflow

1. Open `/products`.
2. Load all products from `/inventory/show-all-products`.
3. Search by product name through `/inventory/search-products?ITEM_NAME=...`.
4. Provide a seller key before update or delete actions.

## Screenshots

### Frontend Screenshots

#### Home Page

![Home Page](frontend/images/homepage.png)

#### Products Page

![Products Page](frontend/images/all_products_page.png)

#### Seller Portal

![Seller Dashboard](frontend/images/seller_dashboard.png)

#### Admin Portal

![Admin Dashboard](frontend/images/admin_dashboard.png)

#### Add Product Form

![Add Product Form](frontend/images/add_product_form.png)

### Backend Screenshots

#### Swagger API Overview

![Swagger Overview](backend/images/swagger_overview.png)

#### Add Item Endpoint Example

![Add Item Endpoint](backend/images/add_item_endpoint.png)

### Database Tables

#### Inventory Table

![Inventory Table](backend/images/inventory_table.png)

#### Seller Table

![Seller Table](backend/images/seller_table.png)

## Security Notes

### Seller Key Authentication

- Each seller is assigned a unique alphanumeric key (4-8 characters)
- Keys are validated server-side before allowing any seller operations
- Seller keys are passed via HTTP headers (`SELLER-KEY`)
- Keys must match the pattern: `^[A-Za-z0-9]+$`
- Sellers can only access and modify their own products

### Admin Key Authentication

- Admin operations require a separate admin key
- Default admin key is configured in `config.py`
- Admin key is passed via HTTP headers (`Admin-Key`)
- Admins have full visibility and control over all sellers and products

### Authorization Logic

- **Product Operations**: Require seller key matching the product's seller
- **Seller Operations**: Require seller key matching the seller being modified
- **Admin Operations**: Require admin key for full system access
- **Public Operations**: Product viewing and searching are publicly accessible

### Security Best Practices

- All sensitive operations require authentication
- Input validation using Pydantic schemas
- SQL injection prevention via SQLAlchemy ORM
- CORS enabled for development (restrict in production)
- Environment variables for sensitive configuration

## Lessons Learned

### Technical Concepts Demonstrated

#### Backend Development

- **RESTful API Design**: Proper HTTP method usage and resource naming conventions
- **Layered Architecture**: Separation of concerns across routes, services, and models
- **ORM Integration**: Database operations using SQLAlchemy with Python
- **Data Validation**: Pydantic schemas for request/response validation
- **Dependency Injection**: FastAPI's dependency injection for database sessions
- **Authentication Patterns**: Header-based authentication for API security
- **Error Handling**: Comprehensive exception handling and user feedback

#### Frontend Development

- **Component-Based Architecture**: Reusable React components for maintainability
- **State Management**: Context API and Redux Toolkit for application state
- **Client-Side Routing**: React Router for SPA navigation
- **API Integration**: Axios for HTTP requests with interceptors
- **CSS Modules**: Scoped styling to prevent style conflicts
- **Responsive Design**: Mobile-first design principles
- **Form Validation**: Client-side validation with user feedback

#### Database Design

- **Relational Modeling**: Foreign key relationships and data integrity
- **ORM Patterns**: SQLAlchemy ORM for database abstraction
- **Schema Design**: Normalized database structure for data consistency
- **Query Optimization**: Efficient database queries with proper indexing

#### Software Engineering Practices

- **Code Organization**: Modular project structure for scalability
- **Documentation**: Comprehensive inline documentation and comments
- **Version Control**: Git for source control and collaboration
- **Environment Configuration**: Environment variables for configuration management
- **Testing Strategy**: Separation of concerns for testability
- **Security Best Practices**: Authentication, validation, and error handling

## Author

**Portfolio Project: Multi-Seller Inventory Management System**

This project demonstrates proficiency in full-stack web development, showcasing skills in:

- Backend API development with FastAPI and Python
- Frontend application development with React and modern JavaScript
- Database design and ORM integration with SQLAlchemy
- RESTful API design and implementation
- Authentication and authorization patterns
- Responsive UI/UX design
- State management in React applications
- Professional code organization and documentation

Built as a demonstration of software engineering best practices and modern web development techniques.

---

**Note**: This is a portfolio project designed to showcase full-stack development capabilities. For production deployment, additional security measures, testing, and monitoring should be implemented.
