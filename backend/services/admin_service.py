# Admin service module for the inventory management system.
# NOTE: This module contains the service function for admin-related operations, specifically for retrieving all sellers along with their associated products with seller keys. The function includes authentication for admin access and returns a structured response containing seller information and their products, ensuring that only authorized admins can access this sensitive data.


from fastapi import HTTPException
from sqlalchemy.orm import Session

from models.db_inventory import Inventory_database
from models.db_seller import Seller_database
from services.auth_services import authenticate_admin


def show_all_sellers_with_products(db_session: Session, admin_key: str):

    authenticate_admin(admin_key)

    sellers = (
        db_session.query(Seller_database).order_by(Seller_database.seller_id).all()
    )

    if not sellers:
        raise HTTPException(status_code=404, detail="No sellers found")

    result = []

    for seller in sellers:  # Loop through each seller one by one

        items = (
            db_session.query(Inventory_database)
            .filter(Inventory_database.seller_id == seller.seller_id)
            .all()
        )

        product_list = []  # Store all products of current seller

        for item in items:  # Loop through seller's products

            product_list.append(
                {
                    "item_id": item.item_id,
                    "item_name": item.item_name,
                    "item_stock_qty": item.item_stock_qty,
                    "item_price": item.item_price,
                }
            )

        result.append(
            {
                "seller_id": seller.seller_id,
                "seller_name": seller.seller_name,
                "seller_email": seller.seller_email,
                "seller_key": seller.seller_key,
                "products": product_list,
            }
        )

    return result
