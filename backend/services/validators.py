from fastapi import HTTPException

from models.db_seller import Seller_database

# -----------------------------------------------------------------------------------------------------------------------------------------------

# Validate Price → Prevent Negative or Zero Price


def validate_price(price: float):
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price cannot be negative or zero")


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Validate Stock → Prevent Negative Stock


def validate_stock(stock: int):
    if stock < 0:
        raise HTTPException(status_code=400, detail="Stock cannot be negative")


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Validate Item Ownership → Prevent unauthorized modification of another seller's product


def validate_item_ownership(item, auth_seller):
    if item.seller_id != auth_seller.seller_id:
        raise HTTPException(
            status_code=403,
            detail="Modification of another seller's product is forbidden",
        )


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Validate Seller Account Ownership → Prevent unauthorized modification of another seller's account


def validate_seller_account_ownership(seller, auth_seller):
    if seller.seller_id != auth_seller.seller_id:
        raise HTTPException(
            status_code=403,
            detail="Modification of another's seller account is forbidden",
        )


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Duplicate Email Check → Prevent Duplicate Email in New Seller Signup and Seller Account Update


def duplicate_email_check(email, db_session):
    existing_email = (
        db_session.query(Seller_database)
        .filter(Seller_database.seller_email == email)
        .first()
    )
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Duplicate Seller Key Check → Prevent Duplicate Seller Key in New Seller Signup and Seller Account Update


def duplicate_key_check(db_session, seller_key: str):
    existing_key = (
        db_session.query(Seller_database)
        .filter(Seller_database.seller_key == seller_key)
        .first()
    )
    if existing_key:
        raise HTTPException(status_code=400, detail="Seller key already exists")
