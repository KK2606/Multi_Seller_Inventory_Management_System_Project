# Pydantic schemas for seller-related data models in the inventory management system.
# NOTE: These schemas define the structure and validation rules for seller responses, as well as the input data required for adding and updating sellers. These schemas ensure that the data returned by seller-related routes is consistent and adheres to the defined format for easy consumption by clients or frontend applications, while also enforcing validation rules for input data to maintain data integrity in the system.

# **Seller key validation rules:**
# - The seller key must be a string consisting of 4 to 8 characters.
# - The seller key must contain only alphanumeric characters (A-Z, a-z, 0-9).

from pydantic import BaseModel, EmailStr, Field


# Pydantic schema for seller response containing seller information
class Seller_Response_Schema(BaseModel):
    seller_id: int
    seller_name: str
    seller_email: EmailStr


# Pydantic schema for adding new sellers to the inventory management system
class Add_Seller_Schema(BaseModel):
    add_seller_name: str
    add_seller_email: EmailStr
    add_seller_key: str = Field(min_length=4, max_length=8, pattern=r"^[A-Za-z0-9]+$")


# Pydantic schema for updating existing sellers in the inventory management system
class Update_Seller_Schema(BaseModel):
    update_seller_name: str | None
    update_seller_email: EmailStr | None
    update_seller_key: str | None = Field(
        default=None, min_length=4, max_length=8, pattern=r"^[A-Za-z0-9]+$"
    )
