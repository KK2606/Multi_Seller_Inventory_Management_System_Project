# Pydantic schemas for admin-related data models in the inventory management system.
# NOTE: These schemas define the structure and validation rules for admin responses, including seller information and associated products, these schemas ensure that the data returned by admin-related routes is consistent and adheres to the defined format for easy consumption by clients or frontend applications.

from pydantic import BaseModel, EmailStr, Field


# Pydantic schema for product information in the admin response
class Product_Schema(BaseModel):
    item_id: int
    item_name: str
    item_stock_qty: int
    item_category: str
    item_price: float


# Pydantic schema for admin response containing seller information and associated products
class Admin_Response_Schema(BaseModel):
    seller_id: int
    seller_name: str
    seller_email: EmailStr
    seller_key: str = Field(min_length=4, max_length=8, pattern=r"^[A-Za-z0-9]+$")
    products: list[Product_Schema]
