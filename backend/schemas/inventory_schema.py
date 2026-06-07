# Pydantic schemas for inventory-related data models in the inventory management system.
# NOTE: These schemas define the structure and validation rules for inventory items, including product details and associated sellers, these schemas ensure that the data returned by inventory-related routes is consistent and adheres to the defined format for easy consumption by clients or frontend applications.

from pydantic import BaseModel


# Pydantic schema for inventory item details in the inventory management system
class Inventory_Response_Schema(BaseModel):
    item_id: int
    item_name: str
    item_description: str
    item_category: str
    item_price: float
    item_stock_qty: int
    in_stock: bool


# Pydantic schema for inventory item details along with associated seller information in the inventory management system
class Inventory_with_Seller_Schema(BaseModel):
    item_id: int
    item_name: str
    item_description: str
    item_category: str
    item_price: float
    in_stock: bool
    seller_id: int
    seller_name: str


# Pydantic schema for adding new inventory items to the inventory management system
class Add_Inventory_Schema(BaseModel):
    add_item_name: str
    add_item_description: str
    add_item_category: str
    add_item_price: float
    add_stock_qty: int


# Pydantic schema for updating existing inventory items in the inventory management system
class Update_Inventory_Schema(BaseModel):
    update_item_name: str | None
    update_item_description: str | None
    update_item_category: str | None
    update_item_price: float | None
    update_stock_qty: int | None
