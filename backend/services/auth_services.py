# Authentication services for the inventory management system.
# NOTE: This module contains the authentication functions for both admin and sellers.

from fastapi import HTTPException

from config import ADMIN_KEY
from db.db_config import Session
from models.db_seller import Seller_database

# -----------------------------------------------------------------------------------------------------------------------------------------------

# Authenticate Admin: Check if the provided admin key matches the predefined ADMIN_KEY. If it does not match, raise an HTTP 401 Unauthorized exception. This function is used to ensure that only authorized admins can access certain functionalities in the system, such as viewing all sellers and their products with their respective seller keys.
# TODO: Future enhancement - implement a more secure authentication mechanism for admins, such as JWT tokens or OAuth, instead of using a static admin key.


def authenticate_admin(admin_key: str):
    if ADMIN_KEY != admin_key:
        raise HTTPException(401, detail="Unauthorized")


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Authenticate Seller: This function takes a seller key and a database session as input. It queries the Seller_database to find a seller with the matching seller key. If no such seller is found, it raises an HTTP 401 Unauthorized exception. If a matching seller is found, it returns the authorized seller object. This function is used to ensure that only authorized sellers can access certain functionalities in the system
# TODO: Future enhancement - implement a more secure way to store and verify seller credentials, such as hashing the seller keys and using a more robust authentication mechanism like JWT tokens or OAuth for sellers as well.


def authenticate_seller(seller_key: str, db_session: Session):
    authorized_seller = (
        db_session.query(Seller_database)
        .filter(Seller_database.seller_key == seller_key)
        .first()
    )
    if not authorized_seller:
        raise HTTPException(401, detail="Unauthorized")
    return authorized_seller
