# Multi-Seller Inventory Management System

![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?style=flat-square&logo=fastapi)

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=flat-square&logo=postgresql)

![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A beginner-friendly backend project built using **FastAPI** and **PostgreSQL** to simulate how real inventory systems work behind the scenes.

This project allows sellers to manage products and inventory while giving admins the ability to monitor the complete system.

It was built mainly to practice:
- Backend architecture
- REST APIs
- Database relationships
- Validation systems
- Service-layer design using Python

---

## 🚀 Quick Start

Get the project running in 5 minutes:

```bash
# 1. Clone and navigate to the project
cd Inventory_System_v2

# 2. Create and activate virtual environment
python -m venv v_env
# Windows: .\v_env\Scripts\Activate.ps1
# Linux/Mac: source v_env/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup PostgreSQL database
# Create a database named "Inventory_Management_System"
# Update db/db_config.py with your credentials

# 5. Run the server
uvicorn main:app --reload

# 6. Import sample data (optional)
python -m scripts.csvdata_seller_import
python -m scripts.csvdata_inventory_import

# 7. Access the API
# Open http://127.0.0.1:8000/docs in your browser
```

---

## 📋 Table of Contents

- [Project Preview](#project-preview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [PostgreSQL Setup](#postgresql-setup)
- [Running the Server](#running-the-server)
- [Importing Sample Data](#importing-sample-data)
- [Swagger API Documentation](#swagger-api-documentation)
- [API Endpoints](#api-endpoints)
- [Example Request](#example-request)
- [Authentication](#authentication)
- [Validation Rules](#validation-rules)
- [Troubleshooting](#troubleshooting)
- [What I Learned From This Project](#what-i-learned-from-this-project)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [Final Notes](#final-notes)

---

## 📸 Project Preview

### Swagger API Overview

> Overview of all available API endpoints.

![Swagger Overview](images/swagger_overview.png)

---

### Add Item Endpoint Example

> Example of request body, responses, and validation for the Add Item API.

![Add Item Endpoint](images/add_item_endpoint.png)

---

### Database Tables

#### Inventory Table

![Inventory Table](images/inventory_table.png)

---

#### Seller Table

![Seller Table](images/seller_table.png)

---

## ✨ Features

### Inventory Management
- Add inventory items
- Update inventory items
- Delete inventory items
- Search inventory items
- View all inventory items
- Automatic stock availability updates
- Seller ownership protection

### Validation & Protection
- Prevent negative stock values
- Prevent negative or zero pricing
- Validate seller ownership with seller key before updates/deletes

### Seller Management
- Register sellers
- Update seller details
- Search sellers
- View all sellers
- Unique email validation
- Unique seller key validation
- Seller authentication system
- Prevent seller deletion if they own inventory items

### Admin Features
Admins can:
- View all sellers with their products
- View seller keys
- Monitor inventory stock
- Check product pricing
- Track seller-product relationships

---

## 🛠️ Tech Stack

| Technology | Purpose              |
| ---------- | -------------------- |
| FastAPI    | Backend framework    |
| PostgreSQL | Database             |
| SQLAlchemy | ORM                  |
| Pydantic   | Data validation      |
| Psycopg2   | PostgreSQL adapter   |
| Uvicorn    | ASGI server          |
| Python     | Programming language |

---

## 📦 Requirements

Main dependencies are stored in the `requirements.txt` file.

Install all dependencies:
```bash
pip install -r requirements.txt
```

---

## 📁 Project Structure

```
Inventory_System_v2/
├── db/                      # Database connection and configuration
│   └── db_config.py            # SQLAlchemy engine and session setup
├── models/                  # SQLAlchemy database table models
│   ├── db_inventory.py         # Inventory table model
│   └── db_seller.py            # Seller table model
├── schemas/                 # Pydantic schemas for request/response validation
│   ├── admin_schema.py         # Admin response schemas
│   ├── inventory_schema.py     # Inventory request/response schemas
│   └── seller_schema.py        # Seller request/response schemas
├── services/                # Business logic and service-layer functions
│   ├── admin_service.py        # Admin business logic
│   ├── auth_services.py        # Authentication services
│   ├── inventory_services.py   # Inventory business logic
│   ├── seller_services.py      # Seller business logic
│   └── validators.py           # Validation functions
├── routes/                  # API route definitions
│   ├── admin_routes.py         # Admin endpoints
│   ├── inventory_routes.py     # Inventory endpoints
│   └── seller_routes.py        # Seller endpoints
├── scripts/                 # CSV import scripts
│   ├── csvdata_inventory_import.py  # Import inventory from CSV
│   └── csvdata_seller_import.py     # Import sellers from CSV
├── sample_data/             # Sample CSV datasets
│   ├── _inventory_data.csv     # Sample inventory data
│   └── _seller_data.csv        # Sample seller data
├── images/                  # README screenshots
├── config.py                # Configuration settings (admin key)
├── main.py                  # Main FastAPI application entry point
├── requirements.txt         # Project dependencies
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Create a Virtual Environment
```bash
python -m venv v_env
```

> 💡 **Tip:** Using a virtual environment keeps your project dependencies isolated and prevents conflicts with other Python projects.

### Activate the Virtual Environment

**Windows (PowerShell):**
```bash
.\v_env\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```bash
v_env\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source v_env/bin/activate
```

Once activated, the terminal should show `(v_env)` indicating the virtual environment is active.

![Virtual Environment Activated](images/v_env_active.png)

### Install Dependencies
```bash
pip install -r requirements.txt
```

> ⚠️ **Note:** Make sure you're in the virtual environment before installing dependencies.

---

## 🗄️ PostgreSQL Setup

1. Create a PostgreSQL database named: `Inventory_Management_System`

2. Open `db/db_config.py`

3. Update the database URL:
```python
 =  = "postgresql://username:password@localhost:port/Inventory_Management_System"
```

Example:
```python
DATABASE_URL = "postgresql://postgres:1234@localhost:5432/Inventory_Management_System"
```

Replace with your PostgreSQL configuration:
- `username` - Your PostgreSQL username
- `password` - Your PostgreSQL password
- `port` - PostgreSQL port (default: 5432)
- `database name` - Your database name

> 🔐 **Security Tip:** Never commit your database credentials to version control. Consider using environment variables for sensitive data in production.

---

## 🏃 Running the Server

Start the FastAPI server:
```bash
uvicorn main:app --reload
```

Once the server starts:
- Database tables are automatically created
- API becomes available locally at `http://127.0.0.1:8000`
- Swagger documentation becomes available at `http://127.0.0.1:8000/docs`

> 💡 **Tip:** The `--reload` flag enables auto-reload when you make changes to the code. Remove it for production deployment.

---

## 📥 Importing Sample Data

After starting the server, import the sample CSV data in the exact order:

1. First, import seller data:
```bash
python -m scripts.csvdata_seller_import
```

2. Second, import inventory data:
```bash
python -m scripts.csvdata_inventory_import
```

> ⚠️ **Important:** Import seller data first, as inventory items reference seller IDs. Importing in the wrong order will cause foreign key errors.

---

## 📚 Swagger API Documentation

Open this URL in your browser: `http://127.0.0.1:8000/docs`

You can:
- Test APIs directly
- View request models
- Check responses
- Explore endpoints visually

---
## 🔌 API Endpoints

### Admin Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/admin/all-sellers-with-products` | View all sellers with their products (requires Admin-Key header) |

### Inventory Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/inventory/show-all-products` | View all inventory items |
| GET | `/inventory/search-products` | Search inventory items by various filters |
| POST | `/inventory/add-product` | Add new inventory item (requires SELLER-KEY header) |
| PUT | `/inventory/update-product` | Update existing inventory item (requires SELLER-KEY header) |
| DELETE | `/inventory/delete-product` | Delete inventory item (requires SELLER-KEY header) |

### Seller Routes

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/seller/new-seller-signup` | Register new seller |
| GET | `/seller/show-all-sellers` | View all sellers |
| GET | `/seller/search-seller` | Search sellers by ID, name, or email |
| PUT | `/seller/update-seller` | Update seller details (requires SELLER-ID and SELLER-KEY) |
| DELETE | `/seller/delete-seller` | Delete seller (requires SELLER-ID and SELLER-KEY) |

---

## 📝 Example Request

### Add Inventory Item

**Headers:**
```
SELLER-KEY: NE456
```

**Request Body:**
```json
{
  "add_item_name": "Gaming Mouse",
  "add_item_description": "RGB gaming mouse",
  "add_item_category": "Electronics",
  "add_item_price": 1200.00,
  "add_stock_qty": 15
}
```

**Note:** The `seller_id` is automatically derived from the `SELLER-KEY` header, so it doesn't need to be included in the request body.

---

## 🔐 Authentication

Some routes require authentication keys for security and ownership validation.

### Seller Key

Each seller has a unique seller key used for:
- Adding inventory items
- Updating inventory items
- Deleting inventory items
- Updating seller details
- Deleting seller account

Seller keys can be:
- Viewed in the seller database table
- Accessed through admin routes using the admin key

**How to use:** Pass the seller key as a header parameter:
```
SELLER-KEY: NE456
```

### Admin Key

Admin routes require a separate admin key that provides access to:
- All sellers and products including seller keys
- Inventory monitoring
- System-wide management features

**How to use:** Pass the admin key as a header parameter:
```
Admin-Key: admin_123
```

**Note:** The admin key is configured in `config.py` and defaults to `admin_123`.

These authentication checks help:
- Protect seller data
- Prevent unauthorized modifications
- Validate seller ownership before inventory updates/deletes

---

## ✅ Validation Rules

### Seller Email Validation
Uses Pydantic `EmailStr` for proper email format validation.

### Seller Key Rules

| Rule | Requirement |
| ---- | ----------- |
| Characters | Alphanumeric only (A-Z, a-z, 0-9) |
| Minimum Length | 4 characters |
| Maximum Length | 8 characters |
| Pattern | `^[A-Za-z0-9]+$` |

### Price Validation
- Price cannot be negative or zero
- Must be a positive float value

### Stock Validation
- Stock quantity cannot be negative
- Stock status (`in_stock`) is automatically updated based on stock quantity

### Ownership Validation
- Sellers can only modify their own inventory items
- Sellers can only modify their own account details
- Attempts to modify another seller's data will result in a 403 Forbidden error

### Duplicate Prevention
- Email addresses must be unique across all sellers
- Seller keys must be unique across all sellers
- Sellers cannot be deleted if they own inventory items (prevents orphaned data)

---

## 🛠️ Troubleshooting

### Common Issues and Solutions

**Issue: "Connection refused" or "Database connection error"**
- **Solution:** Ensure PostgreSQL is running and the database exists. Check your credentials in `db/db_config.py`.

**Issue: "Module not found" errors**
- **Solution:** Make sure you've activated the virtual environment and installed dependencies with `pip install -r requirements.txt`.

**Issue: "Foreign key violation" when importing sample data**
- **Solution:** Ensure you import seller data first, then inventory data. The inventory items reference seller IDs.

**Issue: "401 Unauthorized" when calling API endpoints**
- **Solution:** Some endpoints require authentication headers. Make sure to include `SELLER-KEY` or `Admin-Key` headers as documented in the Authentication section.

**Issue: Port 8000 already in use**
- **Solution:** Either stop the process using port 8000 or use a different port: `uvicorn main:app --port 8001`

**Issue: PowerShell execution policy error when activating venv**
- **Solution:** Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell, then try activating again.

---

## 🎓 What I Learned From This Project

This project helped me practice:
- REST API development with FastAPI
- CRUD operations
- PostgreSQL integration
- SQLAlchemy ORM with relationships
- Backend validation systems using Pydantic
- Service-layer architecture pattern
- Database relationships (foreign keys, joins)
- CSV data importing
- Backend project organization
- Authentication and authorization
- Error handling with HTTP exceptions
- Header-based authentication

---

## 🚀 Future Improvements

Planned upgrades:
- JWT Authentication for more secure authentication
- Password hashing for seller accounts
- Docker Support for containerization
- Pagination for large datasets
- Enhanced product category system with dropdown selection
- Order management system
- Frontend integration (React/Vue.js)
- Automated setup scripts for easier deployment
- Unit and integration tests
- API rate limiting
- Logging and monitoring
- Environment variable configuration

---

## 🤝 Contributing

Contributions are welcome! This is a learning project, so feel free to:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
5. **Push to the branch** (`git push origin feature/AmazingFeature`)
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code structure and naming conventions
- Add comments to explain complex logic
- Test your changes thoroughly before submitting
- Update the README if you add new features

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📌 Final Notes

This project was built as a backend engineering practice project while learning FastAPI and PostgreSQL.

The goal was to keep the project beginner-friendly while still following a clean backend structure similar to real-world applications.

### Architecture Pattern
The project follows a layered architecture:
- **Routes Layer**: Handles HTTP requests and responses
- **Services Layer**: Contains business logic and validation
- **Models Layer**: Defines database structure
- **Schemas Layer**: Handles data validation and serialization

This separation of concerns makes the codebase maintainable and testable.

