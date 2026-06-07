# Inventory services for the inventory management system.
# NOTE: This module contains the service functions for inventory-related operations, including showing all products, searching products based on various criteria, adding new inventory items, updating existing inventory items, and deleting inventory items. Each function includes necessary authentication and validation to ensure that only authorized sellers can modify their own inventory items, and that the data being added or updated meets the required constraints (e.g., non-negative stock quantity and price). The service functions interact with the database models to perform the necessary CRUD operations on the inventory data.

from fastapi import HTTPException

from db.db_config import Session
from models.db_inventory import Inventory_database
from models.db_seller import Seller_database
from schemas.inventory_schema import (Add_Inventory_Schema,
                                      Update_Inventory_Schema)
from services.auth_services import authenticate_seller
from services.validators import (validate_item_ownership, validate_price,
                                 validate_stock)

# -----------------------------------------------------------------------------------------------------------------------------------------------

# Show All Products: This function retrieves all products from the inventory along with their associated seller information.
# TODO: Future updates may include additional features such as pagination, sorting, and filtering to provide a better user experience for users in the system.


def all_products(db_session: Session):  # Show All Products
    items = (
        db_session.query(Inventory_database, Seller_database)
        .join(
            Seller_database, Seller_database.seller_id == Inventory_database.seller_id
        )
        .order_by(Inventory_database.item_id)
        .all()
    )

    result = []

    for item, seller in items:

        result.append(
            {
                "item_id": item.item_id,
                "item_name": item.item_name,
                "item_description": item.item_description,
                "item_category": item.item_category,
                "item_price": item.item_price,
                "item_stock_qty": item.item_stock_qty,
                "in_stock": item.in_stock,
                "seller_id": seller.seller_id,
                "seller_name": seller.seller_name,
            }
        )

    return result


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Search Products: This function allows users to search for products based on various criteria, such as ID, name, category, price, stock availability, and seller information.
# TODO: Future updates may introduce fuzzy search capabilities in future updates to enhance the search functionality and provide more relevant results based on partial matches or similar keywords.


def search_products(
    db_session: Session,
    Item_ID: int = None,
    Item_Name: str = None,
    Item_Category: str = None,
    Item_Price: float = None,
    In_Stock: bool = None,
    Seller_ID: int = None,
    Seller_Name: str = None,
):

    query = (
        db_session.query(Inventory_database, Seller_database)
        .join(
            Seller_database, Seller_database.seller_id == Inventory_database.seller_id
        )
        .order_by(Inventory_database.item_id)
    )

    # Filter by item ID
    if Item_ID is not None:
        query = query.filter(Inventory_database.item_id == Item_ID)

    # Filter by item name
    if Item_Name is not None:
        query = query.filter(Inventory_database.item_name == Item_Name)

    # Filter by item category
    if Item_Category is not None:
        query = query.filter(Inventory_database.item_category == Item_Category)

    # Filter by price
    if Item_Price is not None:
        query = query.filter(Inventory_database.item_price == Item_Price)

    # Filter by stock availability
    if In_Stock is not None:
        query = query.filter(Inventory_database.in_stock == In_Stock)

    # Filter by seller ID
    if Seller_ID is not None:
        query = query.filter(Inventory_database.seller_id == Seller_ID)

    # Filter by seller name
    if Seller_Name is not None:
        query = query.filter(Seller_database.seller_name == Seller_Name)

    # Execute the query and fetch results
    items = query.all()

    if not items:  # No items found matching the search criteria
        raise HTTPException(status_code=404, detail="Item not found")

    result = []

    # Build response manually
    for item, seller in items:  # Loop through each item and its associated seller

        result.append(
            {
                "item_id": item.item_id,
                "item_name": item.item_name,
                "item_description": item.item_description,
                "item_category": item.item_category,
                "item_price": item.item_price,
                "item_stock_qty": item.item_stock_qty,
                "in_stock": item.in_stock,
                "seller_id": seller.seller_id,
                "seller_name": seller.seller_name,
            }
        )

    return result


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Add New Product: This function allows sellers to add new products to the inventory system by providing the necessary product details and their unique seller key for authentication.
# TODO: Future updates may include additional features such as image uploads, product variations, and more advanced validation rules to enhance the product management capabilities for sellers.


def add_product(
    db_session: Session, add_item_data: Add_Inventory_Schema, seller_key: str
):

    auth_seller = authenticate_seller(
        seller_key, db_session
    )  # Authenticate Seller using seller key

    validate_stock(add_item_data.add_stock_qty)  # Prevent Negative stock Quantity

    validate_price(add_item_data.add_item_price)  # Prevent Negative or Zero Price

    stock_status = (
        add_item_data.add_stock_qty > 0
    )  # Auto set stock status based on stock quantity

    item = Inventory_database(
        item_name=add_item_data.add_item_name,
        item_description=add_item_data.add_item_description,
        item_category=add_item_data.add_item_category,
        item_price=add_item_data.add_item_price,
        item_stock_qty=add_item_data.add_stock_qty,
        in_stock=stock_status,
        seller_id=auth_seller.seller_id,
    )  # Create new inventory item with provided data and authenticated seller's ID

    db_session.add(item)
    db_session.commit()
    return item


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Update Existing Product: This function allows sellers to update existing products in the inventory system by providing the item ID, updated product details, and their unique seller key for authentication. The function validates the input data and ensures that only authorized sellers can update their own products in the system.
# TODO: Future updates may include updating product images, product variations, and more advanced validation rules to enhance the product management capabilities for sellers.


def update_product(
    db_session: Session,
    update_item_id: int,
    update_item_data: Update_Inventory_Schema,
    seller_key: str,
):

    auth_seller = authenticate_seller(
        seller_key, db_session
    )  # Authenticate Seller using seller key

    item = (
        db_session.query(Inventory_database)
        .filter(Inventory_database.item_id == update_item_id)
        .first()
    )  # Fetch the item to be updated based on the provided item ID

    if not item:  # Item not found with the provided ID
        raise HTTPException(status_code=404, detail="Item not found")

    validate_item_ownership(
        item, auth_seller
    )  # Validate that the authenticated seller is the owner of the item being updated to ensure that sellers can only update their own products in the system

    # Update item fields if new values are provided

    if update_item_data.update_item_name is not None:
        item.item_name = update_item_data.update_item_name

    if update_item_data.update_item_description is not None:
        item.item_description = update_item_data.update_item_description

    if update_item_data.update_item_category is not None:
        item.item_category = update_item_data.update_item_category

    if update_item_data.update_item_price is not None:

        validate_price(
            update_item_data.update_item_price
        )  # Prevent Negative or Zero Price

        item.item_price = update_item_data.update_item_price

    if update_item_data.update_stock_qty is not None:

        validate_stock(
            update_item_data.update_stock_qty
        )  # Prevent Negative stock Quantity

        item.item_stock_qty = update_item_data.update_stock_qty

        item.in_stock = (
            update_item_data.update_stock_qty > 0
        )  # Auto update stock status based on updated stock quantity

    db_session.commit()
    return item


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Delete Product: This function allows sellers to delete products from the inventory system by providing the item ID and their unique seller key for authentication. The function ensures that only authorized sellers can delete their own products from the system.
# TODO: Future updates may include additional features such as product recovery or archiving to provide a better user experience for sellers.


def delete_product(db_session: Session, del_item_id: int, seller_key: str):

    auth_seller = authenticate_seller(
        seller_key, db_session
    )  # Authenticate Seller using seller key

    item = (
        db_session.query(Inventory_database)
        .filter(Inventory_database.item_id == del_item_id)
        .first()  # Fetch the item to be deleted based on the provided item ID
    )

    if not item:  # Item not found with the provided ID
        raise HTTPException(status_code=404, detail="Item not found")

    validate_item_ownership(
        item, auth_seller
    )  # Validate that the authenticated seller is the owner of the item being deleted to ensure that sellers can only delete their own products from the system

    db_session.delete(item)
    db_session.commit()

    return f"Item {del_item_id} deleted successfully"
