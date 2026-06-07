# # This file represents the sellers table in the Inventory Managemenent System Database

from sqlalchemy import Column, Integer, String

from db.db_config import Base

# Sellers Table Model for the Inventory Management System Database


class Seller_database(Base):
    __tablename__ = "sellers"

    # Unique Seller ID (Primary Key)
    seller_id = Column(Integer, primary_key=True, index=True)

    # Seller/Business Name
    seller_name = Column(String, nullable=False)

    # Unique Seller E-mail
    seller_email = Column(String, unique=True, nullable=False)

    # Unique Seller Key (for authentication)
    seller_key = Column(String, unique=True, nullable=False)
