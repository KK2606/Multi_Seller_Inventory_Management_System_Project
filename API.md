# API Reference

This file documents the FastAPI endpoints implemented in `backend/routes`. FastAPI's interactive documentation is available at `/docs` when the backend is running.

## Base URL

Local backend default:

```text
http://127.0.0.1:8000
```

The React frontend reads its API base URL from:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Authentication Headers

| Header | Used by | Source of truth |
| --- | --- | --- |
| `SELLER-KEY` | Seller dashboard, seller mutations, product mutations | Stored as `sellers.seller_key` in PostgreSQL |
| `Admin-Key` | Admin dashboard | `ADMIN_KEY` environment variable |

FastAPI converts Python header parameter names with underscores to HTTP hyphenated headers, so `Admin_Key` maps to `Admin-Key`.

## Endpoint Summary

| Method | Endpoint | Handler | Auth | Rate limit |
| --- | --- | --- | --- | --- |
| `GET` | `/inventory/show-all-products` | `show_all_items` | Public | `50/minute` |
| `GET` | `/inventory/search-products` | `search_item` | Public | `50/minute` |
| `POST` | `/inventory/add-product` | `add_new_item` | `SELLER-KEY` | `20/minute` |
| `PUT` | `/inventory/update-product` | `update_existing_item` | `SELLER-KEY` | `20/minute` |
| `DELETE` | `/inventory/delete-product` | `delete_existing_item` | `SELLER-KEY` | `20/minute` |
| `POST` | `/seller/new-seller-signup` | `new_seller_signup` | Public | `3/minute` |
| `GET` | `/seller/seller-dashboard` | `get_seller_dashboard` | `SELLER-KEY` | `5/minute` |
| `PUT` | `/seller/update-seller` | `update_existing_seller` | `SELLER-KEY` | `5/minute` |
| `DELETE` | `/seller/delete-seller` | `delete_existing_seller` | `SELLER-KEY` | `5/minute` |
| `GET` | `/admin/admin_dashboard` | `get_admin_dashboard` | `Admin-Key` | `5/minute` |

## Data Schemas

### `Inventory_Response_Schema`

Used by `GET /inventory/show-all-products`, `POST /inventory/add-product`, and `PUT /inventory/update-product`.

| Field | Type |
| --- | --- |
| `item_id` | `int` |
| `item_name` | `str` |
| `item_description` | `str` |
| `item_category` | `str` |
| `item_price` | `float` |
| `item_stock_qty` | `int` |
| `in_stock` | `bool` |

### `Inventory_with_Seller_Schema`

Used by `GET /inventory/search-products`.

| Field | Type |
| --- | --- |
| `item_id` | `int` |
| `item_name` | `str` |
| `item_description` | `str` |
| `item_category` | `str` |
| `item_price` | `float` |
| `in_stock` | `bool` |
| `seller_id` | `int` |
| `seller_name` | `str` |

Implementation note: `search_products()` includes `item_stock_qty` in the service dictionary, but the response model does not include it, so FastAPI filters that field out of the HTTP response.

### `Add_Inventory_Schema`

| Field | Type | Validation |
| --- | --- | --- |
| `add_item_name` | `str` | Required |
| `add_item_description` | `str` | Required |
| `add_item_category` | `str` | Required |
| `add_item_price` | `float` | Must be greater than `0` in service validation |
| `add_stock_qty` | `int` | Must be `0` or greater |

### `Update_Inventory_Schema`

| Field | Type | Behavior |
| --- | --- | --- |
| `update_item_name` | `str | None` | Updated only when not `null` |
| `update_item_description` | `str | None` | Updated only when not `null` |
| `update_item_category` | `str | None` | Updated only when not `null` |
| `update_item_price` | `float | None` | Validated and updated only when not `null` |
| `update_stock_qty` | `int | None` | Validated and updated only when not `null`; also updates `in_stock` |

Because these fields are declared without defaults in the schema, clients should send all update keys and use `null` for unchanged fields. The React frontend follows this pattern.

### `Add_Seller_Schema`

| Field | Type | Validation |
| --- | --- | --- |
| `add_seller_name` | `str` | Required |
| `add_seller_email` | `EmailStr` | Valid email, duplicate checked in service |
| `add_seller_key` | `str` | 4-8 alphanumeric chars, duplicate checked in service |

### `Update_Seller_Schema`

| Field | Type | Behavior |
| --- | --- | --- |
| `update_seller_name` | `str | None` | Updated only when not `null` |
| `update_seller_email` | `EmailStr | None` | Duplicate checked and updated only when not `null` |
| `update_seller_key` | `str | None` | 4-8 alphanumeric chars; duplicate checked and updated only when not `null` |

The current React frontend sends all seller update keys and uses `null` for unchanged values.

### `Admin_Response_Schema`

| Field | Type |
| --- | --- |
| `seller_id` | `int` |
| `seller_name` | `str` |
| `seller_email` | `EmailStr` |
| `seller_key` | `str` |
| `products` | `list[Product_Schema]` |

`Product_Schema` fields: `item_id`, `item_name`, `item_stock_qty`, `item_category`, `item_price`.

## Inventory Endpoints

### `GET /inventory/show-all-products`

Returns all products ordered by `item_id`.

| Property | Value |
| --- | --- |
| Auth | Public |
| Query params | None |
| Response model | `list[Inventory_Response_Schema]` |
| Rate limit | `50/minute` |

Example:

```bash
curl http://127.0.0.1:8000/inventory/show-all-products
```

Implementation note: the service joins sellers and includes `seller_id` and `seller_name` in its internal dictionaries, but the route response model filters those fields out.

### `GET /inventory/search-products`

Searches products with exact-match filters.

| Query parameter | Declared type | Service behavior |
| --- | --- | --- |
| `ITEM_ID` | `int` | Matches `inventory.item_id` |
| `ITEM_NAME` | `str` | Matches `inventory.item_name` exactly |
| `ITEM_CATEGORY` | `str` | Matches `inventory.item_category` exactly |
| `ITEM_PRICE` | `float` | Matches `inventory.item_price` exactly |
| `IN_STOCK` | `bool` | Matches `inventory.in_stock` |
| `SELLER_ID` | `str` in route | Compared with `inventory.seller_id` |
| `SELLER_NAME` | `str` | Matches `sellers.seller_name` exactly |

Example:

```bash
curl "http://127.0.0.1:8000/inventory/search-products?ITEM_NAME=Mechanical%20Keyboard"
```

Responses:

- `200`: list of `Inventory_with_Seller_Schema`
- `404`: `{"detail": "Item not found"}` when no rows match

### `POST /inventory/add-product`

Adds a new product for the authenticated seller.

| Property | Value |
| --- | --- |
| Auth | `SELLER-KEY` header |
| Body | `Add_Inventory_Schema` |
| Response model | `Inventory_Response_Schema` |
| Rate limit | `20/minute` |

Example:

```bash
curl -X POST http://127.0.0.1:8000/inventory/add-product \
  -H "Content-Type: application/json" \
  -H "SELLER-KEY: NE456" \
  -d '{
    "add_item_name": "USB-C Cable",
    "add_item_description": "Braided 1m charging cable",
    "add_item_category": "Accessories",
    "add_item_price": 299,
    "add_stock_qty": 20
  }'
```

Behavior:

- Authenticates seller by `seller_key`.
- Rejects price `<= 0`.
- Rejects stock `< 0`.
- Sets `in_stock` to `true` when stock quantity is greater than `0`.

### `PUT /inventory/update-product`

Updates product fields for a product owned by the authenticated seller.

| Property | Value |
| --- | --- |
| Auth | `SELLER-KEY` header |
| Query params | `ITEM_ID` |
| Body | `Update_Inventory_Schema` |
| Response model | `Inventory_Response_Schema` |
| Rate limit | `20/minute` |

Example:

```bash
curl -X PUT "http://127.0.0.1:8000/inventory/update-product?ITEM_ID=1" \
  -H "Content-Type: application/json" \
  -H "SELLER-KEY: NE456" \
  -d '{
    "update_item_name": null,
    "update_item_description": null,
    "update_item_category": null,
    "update_item_price": 3299,
    "update_stock_qty": null
  }'
```

Responses:

- `401`: invalid seller key
- `403`: seller does not own the product
- `404`: item not found
- `400`: invalid price or stock value

### `DELETE /inventory/delete-product`

Deletes a product owned by the authenticated seller.

| Property | Value |
| --- | --- |
| Auth | `SELLER-KEY` header |
| Query params | `DEL_ID` |
| Response | Plain JSON string |
| Rate limit | `20/minute` |

Example:

```bash
curl -X DELETE "http://127.0.0.1:8000/inventory/delete-product?DEL_ID=1" \
  -H "SELLER-KEY: NE456"
```

Success response:

```json
"Item 1 deleted successfully"
```

## Seller Endpoints

### `POST /seller/new-seller-signup`

Creates a seller account.

| Property | Value |
| --- | --- |
| Auth | Public |
| Body | `Add_Seller_Schema` |
| Response | Plain JSON string |
| Rate limit | `3/minute` |

Example:

```bash
curl -X POST http://127.0.0.1:8000/seller/new-seller-signup \
  -H "Content-Type: application/json" \
  -d '{
    "add_seller_name": "North Star Supplies",
    "add_seller_email": "northstar@example.com",
    "add_seller_key": "NS123"
  }'
```

Success response format:

```json
"New Seller 'North Star Supplies' added successfully with ID 10"
```

### `GET /seller/seller-dashboard`

Returns the authenticated seller profile and products.

| Property | Value |
| --- | --- |
| Auth | `SELLER-KEY` header |
| Response model | None declared |
| Rate limit | `5/minute` |

Example:

```bash
curl http://127.0.0.1:8000/seller/seller-dashboard \
  -H "SELLER-KEY: NE456"
```

Response shape:

```json
{
  "seller_id": 1,
  "seller_name": "Nova Electronics",
  "seller_email": "novaelectronics@gmail.com",
  "seller_key": "NE456",
  "products": [
    {
      "item_id": 1,
      "item_name": "Mechanical Keyboard",
      "item_stock_qty": 12,
      "item_category": "Electronics",
      "item_price": 3499.0
    }
  ]
}
```

### `PUT /seller/update-seller`

Updates seller account fields for the authenticated seller.

| Property | Value |
| --- | --- |
| Auth | `SELLER-KEY` header |
| Query params | `SELLER_ID` |
| Body | `Update_Seller_Schema` |
| Response | Plain JSON string |
| Rate limit | `5/minute` |

Example:

```bash
curl -X PUT "http://127.0.0.1:8000/seller/update-seller?SELLER_ID=1" \
  -H "Content-Type: application/json" \
  -H "SELLER-KEY: NE456" \
  -d '{
    "update_seller_name": "Nova Electronics India",
    "update_seller_email": null,
    "update_seller_key": null
  }'
```

Responses:

- `401`: invalid seller key
- `403`: seller key belongs to another seller
- `404`: seller not found
- `400`: duplicate email or duplicate seller key

### `DELETE /seller/delete-seller`

Deletes a seller account after confirming it has no inventory items.

| Property | Value |
| --- | --- |
| Auth | `SELLER-KEY` header |
| Query params | `DEL_ID` |
| Response | Plain JSON string |
| Rate limit | `5/minute` |

Example:

```bash
curl -X DELETE "http://127.0.0.1:8000/seller/delete-seller?DEL_ID=1" \
  -H "SELLER-KEY: NE456"
```

Responses:

- `400`: `{"detail": "Seller still owns inventory items"}` when products still exist
- `401`: invalid seller key
- `403`: seller key belongs to another seller
- `404`: seller not found

## Admin Endpoints

### `GET /admin/admin_dashboard`

Returns all sellers with seller keys and product summaries.

| Property | Value |
| --- | --- |
| Auth | `Admin-Key` header |
| Response model | `list[Admin_Response_Schema]` |
| Rate limit | `5/minute` |

Example:

```bash
curl http://127.0.0.1:8000/admin/admin_dashboard \
  -H "Admin-Key: replace-with-admin-key"
```

Response shape:

```json
[
  {
    "seller_id": 1,
    "seller_name": "Nova Electronics",
    "seller_email": "novaelectronics@gmail.com",
    "seller_key": "NE456",
    "products": [
      {
        "item_id": 1,
        "item_name": "Mechanical Keyboard",
        "item_stock_qty": 12,
        "item_category": "Electronics",
        "item_price": 3499.0
      }
    ]
  }
]
```

Responses:

- `401`: invalid admin key
- `404`: no sellers found

## Error Responses

| Status | Source | Example detail |
| --- | --- | --- |
| `400` | Validators/business rules | `Price cannot be negative or zero`, `Stock cannot be negative`, `Email already exists`, `Seller key already exists` |
| `401` | Authentication | `Unauthorized` |
| `403` | Ownership checks | `Modification of another seller's product is forbidden` |
| `404` | Missing rows | `Item not found`, `Seller not found`, `No sellers found` |
| `422` | FastAPI/Pydantic validation | Request body/query/header validation errors |
| `429` | SlowAPI rate limiter | `RATE_LIMIT_EXCEEDED` |

Rate-limit response body:

```json
{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again after few minutes."
}
```

## Current API Gaps

These are **Work in Progress / Planned**, not current behavior:

- Pagination and sorting for list endpoints.
- Fuzzy or partial search; current search filters are exact matches.
- API versioning.
- JWT/OAuth/session authentication.
- Hashed seller keys.
- Response schema alignment for fields returned by services but filtered by FastAPI response models.
