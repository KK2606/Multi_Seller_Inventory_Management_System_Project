# Multi-Seller Inventory Management System

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?style=flat-square&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=flat-square&logo=postgresql)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-red?style=flat-square&logo=sqlalchemy)
![Pydantic](https://img.shields.io/badge/Pydantic-2.0+-red?style=flat-square&logo=pydantic)
![React](https://img.shields.io/badge/React-19.2.6-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0.12-purple?style=flat-square&logo=vite)
![Axios](https://img.shields.io/badge/Axios-1.16.1-green?style=flat-square&logo=axios)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)

---

## 🎯 Project Overview

A production-ready full-stack inventory management system that enables multiple independent sellers to manage their product inventory through a centralized platform. This system provides separate, secure interfaces for administrators and sellers, implementing robust key-based authentication and comprehensive product management capabilities.

### Key Highlights

- **Multi-Tenant Architecture**: Support for multiple independent sellers with complete data isolation
- **Role-Based Access Control**: Separate authentication flows for admins and sellers
- **Real-Time Inventory Tracking**: Automatic stock status updates based on quantity
- **Modern Tech Stack**: Built with FastAPI, React, PostgreSQL, and modern development tools
- **Production-Ready**: Comprehensive error handling, validation, and security measures
- **Scalable Design**: Layered architecture following software engineering best practices

### Portfolio Worthiness

This project demonstrates full-stack development proficiency with:
- RESTful API design and implementation
- Database modeling and ORM integration
- Authentication and authorization patterns
- Modern frontend development with React
- Professional code organization and documentation
- End-to-end system architecture understanding

---

## ✨ Features

### Admin Features

- **Admin Dashboard**: Comprehensive overview of all sellers and their products
- **Seller Management**: View, update, and delete seller accounts
- **Product Oversight**: Access to all products across the system
- **System Statistics**: Real-time counts of total sellers and products
- **Authentication**: Secure admin key-based access control
- **Data Visibility**: Full access to seller keys and product details

### Seller Features

- **Seller Registration**: Self-service signup with business information
- **Seller Dashboard**: Personalized interface for inventory management
- **Product Management**: Full CRUD operations for own products
- **Profile Updates**: Modify business information and authentication keys
- **Statistics Tracking**: View personal inventory statistics
- **Secure Access**: Key-based authentication protecting seller data

### Inventory Features

- **Product CRUD**: Complete create, read, update, delete operations
- **Stock Management**: Automatic stock status (in stock/out of stock)
- **Product Categorization**: Organize products by category
- **Price Management**: Track and update product pricing
- **Quantity Tracking**: Monitor stock levels in real-time
- **Bulk Operations**: Efficient management of multiple products

### Product Management Features

- **Add Products**: Create new inventory items with validation
- **Update Products**: Modify existing product details
- **Delete Products**: Remove products with confirmation dialogs
- **Product Search**: Find products by name, category, or other criteria
- **Stock Alerts**: Visual indicators for stock availability
- **Product Cards**: Modern card-based UI for product display

### Search Features

- **Multi-Criteria Search**: Filter by ID, name, category, price, stock status
- **Real-Time Search**: Instant results as you type
- **Seller-Based Search**: Find products by specific sellers
- **Advanced Filtering**: Combine multiple search parameters
- **Empty State Handling**: Clear messaging when no results found

### Authentication Features

- **Seller Key Authentication**: Unique alphanumeric keys (4-8 characters)
- **Admin Key Authentication**: Separate admin access layer
- **Header-Based Auth**: Secure HTTP header authentication
- **Server-Side Validation**: Robust key validation before access
- **Ownership Verification**: Sellers can only modify their own data
- **Session Management**: Secure logout functionality

### Dashboard Features

- **Statistics Cards**: Visual display of key metrics
- **Product Grids**: Organized product displays
- **Seller Cards**: Comprehensive seller information
- **Action Buttons**: Quick access to common operations
- **Loading States**: Visual feedback during data fetching
- **Empty States**: User-friendly messaging for no data scenarios

### API Features

- **RESTful Design**: Proper HTTP method usage and resource naming
- **Pydantic Validation**: Request/response data validation
- **Error Handling**: Comprehensive exception handling
- **CORS Support**: Cross-origin resource sharing enabled
- **Auto Documentation**: Swagger/OpenAPI integration
- **Layered Architecture**: Separation of concerns for maintainability

## Overview

This project addresses the challenge of inventory management for multiple independent sellers by providing a unified platform where each seller can independently manage their product catalog while administrators maintain oversight of the entire system. The solution separates concerns between sellers (who manage their own inventory) and administrators (who oversee all sellers and products), ensuring data isolation and security through unique authentication keys.

## Features

### Seller Management
- **Seller Registration**: New sellers can sign up with business name, email, and unique seller key
- **Seller Dashboard**: Dedicated interface for sellers to view and manage their products
- **Seller Profile Updates**: Sellers can update their business information and authentication keys
- **Seller Search**: Search functionality to find sellers by ID, name, or email
- **Seller Deletion**: Admin capability to remove sellers from the system

### Inventory Management
- **Product CRUD Operations**: Complete create, read, update, delete functionality for products
- **Product Search**: Advanced search by product ID, name, category, price, stock status, and seller
- **Stock Management**: Automatic stock status tracking (in stock/out of stock based on quantity)
- **Product Categories**: Categorization system for better product organization
- **Bulk Operations**: Support for managing multiple products efficiently

### Admin Dashboard
- **System Overview**: View all sellers and their associated products in one dashboard
- **Statistics**: Real-time counts of total sellers and products
- **Seller Management**: Full control over seller accounts including updates and deletions
- **Product Oversight**: Ability to view and manage any product in the system

### Authentication & Security
- **Seller Key Authentication**: Unique alphanumeric keys for seller identification and authorization
- **Admin Key Authentication**: Separate authentication layer for administrative access
- **Header-Based Auth**: Secure authentication via HTTP headers
- **Key Validation**: Server-side validation of authentication keys before granting access

### User Experience
- **Responsive Design**: Mobile-friendly interface that works across all devices
- **Real-time Feedback**: Toast notifications for all user actions
- **Loading States**: Visual feedback during data fetching and processing
- **Error Handling**: Comprehensive error messages and validation feedback
- **Empty States**: Clear messaging when no data is available

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs with Python
- **SQLAlchemy ORM**: Python SQL toolkit and ORM for database operations
- **PostgreSQL**: Relational database for persistent data storage
- **Pydantic**: Data validation using Python type annotations
- **Uvicorn**: ASGI server for running FastAPI applications

### Frontend
- **React 19**: Modern JavaScript library for building user interfaces
- **Vite**: Next-generation frontend tooling for fast development
- **Axios**: Promise-based HTTP client for API communication
- **React Router DOM**: Client-side routing for single-page applications
- **React Hot Toast**: Beautiful toast notifications for user feedback
- **Redux Toolkit**: State management for complex application state
- **Bootstrap 5**: CSS framework for responsive design

## System Architecture

### Backend Architecture
The backend follows a layered architecture pattern:

```
┌─────────────────────────────────────┐
│         FastAPI Application         │
│  (main.py - Entry Point)            │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌─────▼──────┐
│   Routes    │  │   Models   │
│  (API Layer)│  │  (ORM)     │
└──────┬──────┘  └─────┬──────┘
       │                │
┌──────▼────────────────▼──────┐
│         Services              │
│   (Business Logic Layer)      │
└──────┬───────────────────────┘
       │
┌──────▼───────────────────────┐
│         Database              │
│   (PostgreSQL via SQLAlchemy) │
└──────────────────────────────┘
```

### Frontend Architecture
The frontend follows a component-based architecture:

```
┌─────────────────────────────────────┐
│         React Application           │
│  (App.jsx - Root Component)         │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌─────▼──────┐
│   Pages     │  │ Components │
│  (Routes)   │  │  (Reusable) │
└──────┬──────┘  └─────┬──────┘
       │                │
┌──────▼────────────────▼──────┐
│         Services              │
│   (API Calls via Axios)      │
└──────┬───────────────────────┘
       │
┌──────▼───────────────────────┐
│         Context/Redux        │
│   (State Management)         │
└──────────────────────────────┘
```

### API Flow
1. **Frontend Request**: React component triggers API call via Axios
2. **Route Handler**: FastAPI route receives request and validates authentication
3. **Service Layer**: Business logic is executed in service functions
4. **Database Query**: SQLAlchemy ORM queries PostgreSQL database
5. **Response Processing**: Pydantic schemas validate and format response data
6. **Frontend Update**: React component updates state with response data

## Database Design

### Entities and Relationships

#### Sellers Table
```python
seller_id (PK, Integer)      # Unique identifier for each seller
seller_name (String)         # Business name of the seller
seller_email (String)         # Unique email address for seller
seller_key (String)          # Unique authentication key (4-8 alphanumeric chars)
```

#### Inventory Table
```python
item_id (PK, Integer)        # Unique identifier for each product
item_name (String)           # Product name
item_description (String)    # Product description
item_category (String)       # Product category
item_price (Float)           # Product price
item_stock_qty (Integer)     # Available stock quantity
in_stock (Boolean)           # Stock availability status
seller_id (FK, Integer)      # Foreign key referencing sellers.seller_id
```

### Relationship
- **One-to-Many**: One seller can have multiple products
- **Foreign Key**: `inventory.seller_id` references `sellers.seller_id`
- **Cascade**: Products are deleted when their associated seller is deleted

## API Endpoints

| Method | Route | Purpose | Authentication |
|--------|-------|---------|----------------|
| GET | `/inventory/show-all-products` | Retrieve all products in the system | None |
| GET | `/inventory/search-products` | Search products by various criteria | None |
| POST | `/inventory/add-product` | Add a new product to inventory | Seller Key |
| PUT | `/inventory/update-product` | Update an existing product | Seller Key |
| DELETE | `/inventory/delete-product` | Delete a product from inventory | Seller Key |
| POST | `/seller/new-seller-signup` | Register a new seller | None |
| GET | `/seller/seller-dashboard` | Get seller's products | Seller Key |
| GET | `/seller/search-seller` | Search sellers by criteria | None |
| PUT | `/seller/update-seller` | Update seller information | Seller Key |
| DELETE | `/seller/delete-seller` | Delete a seller from system | Seller Key |
| GET | `/admin/admin_dashboard` | Get all sellers with products | Admin Key |

## Project Structure

```
Inventory_System_v2/
├── backend/
│   ├── db/
│   │   ├── db_config.py          # Database configuration and session management
│   │   └── db_inventory.py       # Inventory table creation script
│   ├── models/
│   │   ├── db_seller.py          # Seller ORM model
│   │   └── db_inventory.py       # Inventory ORM model
│   ├── routes/
│   │   ├── admin_routes.py       # Admin API endpoints
│   │   ├── inventory_routes.py   # Inventory API endpoints
│   │   └── seller_routes.py     # Seller API endpoints
│   ├── schemas/
│   │   ├── admin_schema.py       # Admin response validation schemas
│   │   ├── inventory_schema.py   # Inventory validation schemas
│   │   └── seller_schema.py     # Seller validation schemas
│   ├── services/
│   │   ├── admin_service.py      # Admin business logic
│   │   ├── auth_services.py      # Authentication services
│   │   ├── inventory_services.py # Inventory business logic
│   │   ├── seller_services.py    # Seller business logic
│   │   └── validators.py         # Input validation utilities
│   ├── config.py                 # Application configuration
│   ├── main.py                   # FastAPI application entry point
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Product_Card.jsx
│   │   │   ├── Product_Table.jsx
│   │   │   ├── Seller_Card.jsx
│   │   │   └── ...
│   │   ├── context/              # React Context providers
│   │   │   └── Seller_Context.jsx
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Add_Product.jsx
│   │   │   ├── Update_Product.jsx
│   │   │   ├── Seller_Portal.jsx
│   │   │   ├── Admin_Portal.jsx
│   │   │   ├── Update_Seller.jsx
│   │   │   └── New_Seller.jsx
│   │   ├── services/             # API service layer
│   │   │   └── api.jsx
│   │   ├── styles/               # CSS modules
│   │   │   ├── HomeNew.module.css
│   │   │   ├── NavbarNew.module.css
│   │   │   ├── ProductsNew.module.css
│   │   │   ├── FormNew.module.css
│   │   │   ├── SellerPortal.module.css
│   │   │   └── AdminPortalNew.module.css
│   │   ├── App.jsx               # Main app component with routing
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css             # Global styles
│   ├── .env                      # Environment variables
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Node.js dependencies
│   └── vite.config.js            # Vite configuration
└── README.md                     # Project documentation
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv v_env
```

3. Activate the virtual environment:
```bash
# On Windows
v_env\Scripts\activate

# On macOS/Linux
source v_env/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure the database:
- Update the database connection string in `db/db_config.py`
- Run the database initialization script:
```bash
python db/db_inventory.py
```

6. Start the FastAPI server:
```bash
uvicorn main:app --reload
```
6. Import sample data (optional):
```bash
python -m scripts.csvdata_seller_import
python -m scripts.csvdata_inventory_import
```


The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure the API base URL in `.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE inventory_management;
```

2. Update the database connection string in `backend/db/db_config.py`:
```python
DATABASE_URL = "postgresql://username:password@localhost/inventory_management"
```

3. The application will automatically create tables on first run.

## Usage Guide

### Admin Workflow

1. **Access Admin Portal**: Navigate to `/admin-portal`
2. **Authentication**: Enter the admin key (default: `admin_123`)
3. **View Dashboard**: See all sellers and their products
4. **Manage Sellers**: 
   - Click "Edit Seller" to update seller information
   - Click "Delete Seller" to remove a seller and all their products
5. **Manage Products**: View and manage any product in the system
6. **Logout**: Click the logout button to exit admin mode

### Seller Workflow

1. **Seller Registration**: Navigate to `/new-seller-signup` to create a new seller account
2. **Access Seller Portal**: Navigate to `/seller-portal`
3. **Authentication**: Enter your unique seller key
4. **View Dashboard**: See your products with statistics
5. **Add Products**: Click "Add New Product" to add items to your inventory
6. **Manage Products**:
   - Click "Edit" to update product details
   - Click "Delete" to remove products (with confirmation)
7. **Logout**: Click the logout button to exit seller mode

### Inventory Workflow

1. **Browse Products**: Navigate to `/products` to view all products
2. **Search Products**: Use the search bar to filter by product name
3. **View Details**: Each product card shows name, description, category, price, and stock status
4. **Stock Status**: Products display "IN STOCK" or "OUT OF STOCK" badges
5. **Filter by Seller**: View products from specific sellers

## Screenshots

### Frontend Screenshots

### Home Page
![Home Page](frontend/images/homepage.png)

### Products Page
![Products Page](frontend/images/all_products_page.png)

### Seller Portal
![Seller Dashboard](frontend/images/seller_dashboard.png)

### Admin Portal
![Admin Dashboardl](frontend/images/admin_dashboard.png)

### Add Product Form
![Add Product Form](frontend/images/add_product_form.png)

### Backend Screenshots

### Swagger API Overview

> Overview of all available API endpoints.

![Swagger Overview](backend/images/swagger_overview.png)

### Add Item Endpoint Example

> Example of request body, responses, and validation for the Add Item API.

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

## Future Improvements

### Backend Enhancements
- **JWT Authentication**: Replace static keys with token-based authentication
- **Password Hashing**: Implement bcrypt for secure password storage
- **Rate Limiting**: Add API rate limiting to prevent abuse
- **Logging**: Comprehensive request/response logging for debugging
- **Pagination**: Implement pagination for large datasets
- **File Upload**: Add product image upload functionality
- **Email Verification**: Verify seller email addresses during registration
- **Audit Trail**: Track all changes to seller and product data

### Frontend Enhancements
- **TypeScript Migration**: Add type safety with TypeScript
- **Dark Mode**: Implement theme switching
- **Advanced Filtering**: Multi-criteria filtering for products
- **Export Functionality**: Export data to CSV/Excel
- **Charts and Analytics**: Visual analytics dashboard
- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: Service worker for offline functionality
- **Performance Optimization**: Implement code splitting and lazy loading

### Database Enhancements
- **Soft Delete**: Implement soft delete for data recovery
- **Indexing**: Add database indexes for improved query performance
- **Data Archiving**: Archive old data for long-term storage
- **Backup Strategy**: Automated database backup system

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
