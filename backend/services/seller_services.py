from fastapi import HTTPException

from db.db_config import Session
from models.db_inventory import Inventory_database
from models.db_seller import Seller_database
from schemas.seller_schema import Add_Seller_Schema, Update_Seller_Schema
from services.auth_services import authenticate_seller
from services.validators import (duplicate_email_check, duplicate_key_check,
                                 validate_seller_account_ownership)

# -----------------------------------------------------------------------------------------------------------------------------------------------

# Show All Sellers: This function retrieves all sellers from the inventory system and returns them as a list. The sellers are ordered by their seller ID for better organization and readability.
# TODO: Future updates may include additional features such as pagination, sorting, and filtering to provide a better user experience for users in the system.


def get_seller_with_their_products(
    db_session: Session,
    seller_key: str
):

    seller = authenticate_seller(
        seller_key,
        db_session
    )

    items = (
        db_session.query(
            Inventory_database
        )
        .filter(
            Inventory_database.seller_id
            == seller.seller_id
        )
        .all()
    )

    product_list = []

    for item in items:

        product_list.append(
            {
                "item_id": item.item_id,

                "item_name": item.item_name,

                "item_stock_qty": item.item_stock_qty,
                
                "item_category": item.item_category,

                "item_price": item.item_price,
                
            }
        )

    return {
        "seller_id":
            seller.seller_id,

        "seller_name":
            seller.seller_name,

        "seller_email":
            seller.seller_email,

        "seller_key":
            seller.seller_key,

        "products":
            product_list,
    }

# -----------------------------------------------------------------------------------------------------------------------------------------------


# Add New Seller: This function allows new sellers to be added to the inventory system by providing their name, email, and a unique seller key. The function checks for duplicate email and seller key to maintain data integrity in the system before creating a new seller account.
# TODO: Future updates may include additional validation rules and more advanced account creation capabilities to enhance the seller account management features.


def new_seller(db_session: Session, add_seller_data: Add_Seller_Schema):  # Add Seller

    duplicate_email_check(add_seller_data.add_seller_email, db_session)

    duplicate_key_check(db_session, add_seller_data.add_seller_key)

    seller = Seller_database(
        seller_name=add_seller_data.add_seller_name,
        seller_email=add_seller_data.add_seller_email,
        seller_key=add_seller_data.add_seller_key,
    )

    db_session.add(seller)
    db_session.commit()
    return f"New Seller '{add_seller_data.add_seller_name}' added successfully with ID {seller.seller_id}"


#-----------------------------------------------------------------------------------------------------------------------------------------------

# Update Seller Account: This function allows sellers to update their account information in the inventory system by providing their unique seller ID, updated seller data, and seller key for authentication. The function ensures that only authorized sellers can update their own account information and checks for duplicate email and seller key to maintain data integrity in the system.
# TODO: Future updates may include additional validation rules and more advanced update capabilities to enhance the seller account management features.


def update_seller(
    db_session: Session,
    update_seller_id: int,
    update_seller_data: Update_Seller_Schema,
    seller_key: str,
):

    auth_seller = authenticate_seller(
        seller_key, db_session
    )  # Authenticate Seller using seller key to ensure that only authorized sellers can update their own account

    seller = (
        db_session.query(Seller_database)
        .filter(Seller_database.seller_id == update_seller_id)
        .first()
    )  #

    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    validate_seller_account_ownership(
        seller, auth_seller
    )  # Validate that the authenticated seller is the owner of the account being updated

    if update_seller_data.update_seller_name is not None:
        seller.seller_name = update_seller_data.update_seller_name

    if update_seller_data.update_seller_email is not None:
        duplicate_email_check(update_seller_data.update_seller_email, db_session)

        seller.seller_email = update_seller_data.update_seller_email

    if update_seller_data.update_seller_key is not None:
        duplicate_key_check(db_session, update_seller_data.update_seller_key)

        seller.seller_key = update_seller_data.update_seller_key

    db_session.commit()
    return f"Seller {update_seller_id} '{seller.seller_name}' updated successfully"


# -----------------------------------------------------------------------------------------------------------------------------------------------

# DELETE SELLER ACCOUNT: This function allows sellers to delete their accounts from the inventory system by providing their unique seller ID and seller key for authentication. The function ensures that only authorized sellers can delete their own accounts and checks for any existing inventory items associated with the seller before allowing the deletion to prevent orphan stock in the system.
# TODO: Future updates may include additional features such as account recovery or deactivation instead of permanent deletion to provide a better user experience for sellers.

# ! STATUS: Completed and fully functional (DON'T TOUCH)

def delete_seller(db_session: Session, del_seller_id: int, seller_key: str):

    auth_seller = authenticate_seller(
        seller_key, db_session
    )  # Authenticate Seller using seller key to ensure that only authorized sellers can delete their own accounts

    seller = (
        db_session.query(Seller_database)
        .filter(Seller_database.seller_id == del_seller_id)
        .first()
    )

    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")

    validate_seller_account_ownership(
        seller, auth_seller
    )  # Validate that the authenticated seller is the owner of the account being deleted

    existing_items = (
        db_session.query(Inventory_database)
        .filter(Inventory_database.seller_id == seller.seller_id)
        .first()
    )

    if (
        existing_items
    ):  # Check for existing inventory items associated with the seller to prevent orphan stock
        raise HTTPException(status_code=400, detail="Seller still owns inventory items")

    db_session.delete(seller)
    db_session.commit()

    return f"Seller {del_seller_id} '{seller.seller_name}' deleted successfully"
