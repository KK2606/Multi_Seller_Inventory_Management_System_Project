# This file represents the inventory table in the Inventory Managemenent System Database


from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String

from db.db_config import Base

# Inventory Table Model for the Inventory Management System Database


class Inventory_database(Base):
    __tablename__ = "inventory"

    # Unique Product ID (primary key)
    item_id = Column(Integer, primary_key=True, index=True)

    # Product Name
    item_name = Column(String, nullable=False)

    # Product Description
    item_description = Column(String, nullable=False)

    # Product Category
    # NOTE: Will convert into dropdown/category system in future updates
    item_category = Column(String, nullable=False)

    # Product Price
    item_price = Column(Float, nullable=False)

    # Available Stock Quantity
    item_stock_qty = Column(Integer, default=0, nullable=False)

    # Product Stock Availability status (True if in stock, False if out of stock)
    in_stock = Column(Boolean, default=False, nullable=False)

    # Seller ID (Foreign Key referencing Sellers table)
    seller_id = Column(Integer, ForeignKey("sellers.seller_id"), nullable=False)
