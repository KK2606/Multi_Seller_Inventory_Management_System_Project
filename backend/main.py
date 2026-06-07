# Main application file for Inventory Management System Backend Service
# NOTE: This file serves as the entry point for the FastAPI application, where all routes and database configurations are set up. It includes the necessary imports, initializes the FastAPI app, creates database tables, and includes routers for admin, inventory, and seller functionalities. Future updates may include additional middleware for logging, error handling, and security enhancements to further improve the robustness of the application.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.db_config import Base, engine
from routes.admin_routes import admin_router
from routes.inventory_routes import inventory_router
from routes.seller_routes import seller_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#-----------------------------------------------------------------------------------------------------------------------------------------------

# Admin Main

app.include_router(admin_router) # NOTE: Admin routes are protected and require an admin key for authentication

#-----------------------------------------------------------------------------------------------------------------------------------------------

# Inventory Main

app.include_router(inventory_router)

#-----------------------------------------------------------------------------------------------------------------------------------------------

# Seller Main

app.include_router(seller_router) 
