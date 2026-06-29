# Database Documentation

The backend uses SQLAlchemy ORM models with a PostgreSQL database connection from `DATABASE_URL`. The database is configured in `backend/db/db_config.py` and models are defined in `backend/models`.

## Database Technology

| Concern | Implementation |
| --- | --- |
| Database | PostgreSQL |
| Python ORM | SQLAlchemy `2.0.50` |
| Driver | `psycopg2` `2.9.12` |
| Session management | `sessionmaker(autocommit=False, autoflush=False, bind=engine)` |
| FastAPI dependency | `get_db()` yields and closes one SQLAlchemy session per request |
| Migrations | Not implemented |
| Startup table creation | `Base.metadata.create_all(bind=engine)` in `backend/main.py` |
| Seed data | CSV import when tables are empty |

## Configuration

`backend/db/db_config.py` loads `.env` with `python-dotenv` and reads:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

The connection string is passed directly to:

```python
engine = create_engine(DATABASE_URL)
```

> Security note: the current file prints `DATABASE_URL` at import time. Remove or redact this before production use.

## Entity Relationship Diagram

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

## Tables

### `sellers`

Defined by `backend/models/db_seller.py` as `Seller_database`.

| Column | SQLAlchemy type | Constraints / behavior |
| --- | --- | --- |
| `seller_id` | `Integer` | Primary key, indexed |
| `seller_name` | `String` | `nullable=False` |
| `seller_email` | `String` | `unique=True`, `nullable=False` |
| `seller_key` | `String` | `unique=True`, `nullable=False`; used as seller authentication key |

Related schemas:

- `Seller_Response_Schema`
- `Add_Seller_Schema`
- `Update_Seller_Schema`
- `Admin_Response_Schema`

### `inventory`

Defined by `backend/models/db_inventory.py` as `Inventory_database`.

| Column | SQLAlchemy type | Constraints / behavior |
| --- | --- | --- |
| `item_id` | `Integer` | Primary key, indexed |
| `item_name` | `String` | `nullable=False` |
| `item_description` | `String` | `nullable=False` |
| `item_category` | `String` | `nullable=False`; code comment plans a future dropdown/category system |
| `item_price` | `Float` | `nullable=False`; service rejects `<= 0` |
| `item_stock_qty` | `Integer` | `default=0`, `nullable=False`; service rejects `< 0` |
| `in_stock` | `Boolean` | `default=False`, `nullable=False`; create/update services derive it from stock quantity |
| `seller_id` | `Integer` | Foreign key to `sellers.seller_id`, `nullable=False` |

Related schemas:

- `Inventory_Response_Schema`
- `Inventory_with_Seller_Schema`
- `Add_Inventory_Schema`
- `Update_Inventory_Schema`
- `Product_Schema`

## Relationship Model

The database-level relationship is:

- One seller can own many inventory items.
- Each inventory item belongs to exactly one seller.

The models define the foreign key but do not define SQLAlchemy `relationship()` attributes. Joins are written explicitly in service functions.

No cascade delete is configured. Instead, `delete_seller()` checks whether the seller owns any inventory items and raises:

```json
{"detail": "Seller still owns inventory items"}
```

when a seller still has products.

## Startup and Seeding Flow

```mermaid
sequenceDiagram
    participant App as backend/main.py
    participant Meta as SQLAlchemy metadata
    participant Seed as seed_database()
    participant SellerCSV as _seller_data.csv
    participant InventoryCSV as _inventory_data.csv
    participant DB as PostgreSQL

    App->>Meta: Base.metadata.create_all(bind=engine)
    Meta->>DB: create missing sellers/inventory tables
    App->>Seed: seed_database()
    Seed->>DB: count sellers
    alt seller_count == 0
        Seed->>SellerCSV: read seller CSV
        Seed->>DB: insert sellers
    end
    Seed->>DB: count inventory
    alt inventory_count == 0
        Seed->>InventoryCSV: read inventory CSV
        Seed->>DB: insert inventory items
    end
```

Seed files:

| File | Rows excluding header | Imported by |
| --- | ---: | --- |
| `backend/sample_data/_seller_data.csv` | 9 | `scripts/csvdata_seller_import.py` |
| `backend/sample_data/_inventory_data.csv` | 20 | `scripts/csvdata_inventory_import.py` |

Seeding only runs when the respective table count is `0`.

## Data Access Patterns

| Service function | Query/mutation behavior |
| --- | --- |
| `all_products()` | Joins `Inventory_database` and `Seller_database`, orders by `item_id` |
| `search_products()` | Joins inventory/sellers, applies exact-match filters, raises `404` when empty |
| `add_product()` | Authenticates seller, validates price/stock, inserts inventory row |
| `update_product()` | Authenticates seller, loads product by ID, verifies ownership, updates non-null fields |
| `delete_product()` | Authenticates seller, loads product by ID, verifies ownership, deletes row |
| `new_seller()` | Checks duplicate email/key, inserts seller row |
| `get_seller_with_their_products()` | Authenticates seller, loads products where `inventory.seller_id == seller.seller_id` |
| `update_seller()` | Authenticates seller, verifies ownership, updates non-null fields |
| `delete_seller()` | Authenticates seller, verifies ownership, blocks deletion if inventory exists |
| `show_all_sellers_with_products()` | Authenticates admin, loads all sellers and each seller's products |

## Validation and Constraints

### Database Constraints

- `sellers.seller_email` is unique.
- `sellers.seller_key` is unique.
- `inventory.seller_id` is a foreign key to `sellers.seller_id`.
- Required model columns use `nullable=False`.

### Service-Level Constraints

- Product price must be greater than zero.
- Product stock must not be negative.
- Seller email must not duplicate another seller.
- Seller key must not duplicate another seller.
- Sellers can only update/delete their own account.
- Sellers can only update/delete their own products.
- Seller deletion is blocked while that seller still has inventory.

### Pydantic Constraints

- Seller email fields use `EmailStr`.
- Seller keys are 4-8 alphanumeric characters on create/update.

## Schema Notes and Current Gaps

| Topic | Current state |
| --- | --- |
| Migrations | **Planned.** No Alembic or migration scripts are present. |
| Indexes | Only primary key columns use `index=True`; no extra indexes exist for search fields. |
| Relationships | Foreign key exists, but no SQLAlchemy `relationship()` fields are defined. |
| Cascades | Not configured; seller deletion is guarded in service code. |
| Auditing | No `created_at`, `updated_at`, or deleted/deactivated columns. |
| Soft delete | Not implemented. |
| Category normalization | **Planned.** Categories are free-text strings today. |
| Product images | **Planned.** No image/file table or upload flow exists. |

## Operational Notes

- Ensure PostgreSQL exists before starting the backend.
- Run `uvicorn main:app --reload` from `backend/` for local development.
- `create_all()` can create missing tables but does not manage schema evolution.
- Seed scripts assume seller rows are present before inventory rows because inventory rows reference seller IDs.
- Existing rows are checked by name/description/seller ID for inventory import and email/key for seller import.
