from fastapi import APIRouter, Depends, Header, Request

from db.db_config import Session, get_db
from schemas.seller_schema import (Add_Seller_Schema, Seller_Response_Schema,
                                   Update_Seller_Schema)
from services.seller_services import (get_seller_with_their_products, delete_seller, new_seller,
                                       update_seller)

from core.rate_limiter import limiter

seller_router = APIRouter(prefix="/seller", tags=["Seller Management"])

# -----------------------------------------------------------------------------------------------------------------------------------------------

# New Seller Signup
# NOTE: This route allows new sellers to sign up and create an account in the inventory management system by providing their business name, email, and a unique seller key for authentication. The route validates the input data and ensures that the email and seller key are unique to prevent duplicate accounts in the system.
# TODO: Future updates may include additional features such as seller verification, seller dashboard, and more advanced validation rules to enhance the seller management capabilities in the system.


@seller_router.post(
    "/new-seller-signup"
)  # Add New Seller
@limiter.limit("3/minute")  # Rate limit: 3 requests per minute for this endpoint
def new_seller_signup(
    request: Request,
    add_seller_data: Add_Seller_Schema, db_session: Session = Depends(get_db)
):
    return new_seller(db_session, add_seller_data)


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Show All Sellers in the Inventory Management System
# NOTE: This route allows users to view all sellers in the inventory management system along with their associated information, such as business name and email. The route retrieves the seller data from the database and returns it in a structured format for easy consumption by clients or frontend applications.
# TODO: Future updates may include additional features such as pagination, sorting, and filtering to provide a better user experience for users in the system.


@seller_router.get(
    "/seller-dashboard"
)
@limiter.limit("5/minute")  # Rate limit: 5 requests per minute for this endpoint
def get_seller_dashboard(
    request: Request,
    SELLER_KEY: str = Header(None),
    db_session: Session = Depends(get_db),
):
    return get_seller_with_their_products(
        db_session,
        seller_key=SELLER_KEY
    )

# -----------------------------------------------------------------------------------------------------------------------------------------------


# Update existing seller information in the inventory management system
# NOTE: This route allows authorized users to update the information of existing sellers in the inventory management system by providing the seller ID, updated seller data, and their unique seller key for authentication. The route validates the input data and ensures that only authorized users can update seller information in the system.
# TODO: Future updates may include additional validation rules and more advanced update capabilities to enhance the seller management features.


@seller_router.put(
    "/update-seller"
)  # Update Existing Sellers
@limiter.limit("5/minute")  # Rate limit: 5 requests per minute for this endpoint
def update_existing_seller(
    request: Request,
    update_seller_data: Update_Seller_Schema,
    SELLER_ID: int,
    SELLER_KEY: str = Header(None),
    db_session: Session = Depends(get_db),
):
    return update_seller(
        db_session,
        update_seller_id=SELLER_ID,
        update_seller_data=update_seller_data,
        seller_key=SELLER_KEY,
    )


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Delete existing seller from the inventory management system
# NOTE: This route allows authorized users to delete existing sellers from the inventory management system by providing the seller ID and their unique seller key for authentication. The route validates the input data and ensures that only authorized users can delete sellers from the system.
# TODO: Future updates may include additional features such as seller recovery or archiving to provide a better user experience for users in the system.


@seller_router.delete("/delete-seller")
@limiter.limit("5/minute")  # Rate limit: 5 requests per minute for this endpoint
def delete_existing_seller(
    request: Request,
    DEL_ID: int = None,
    SELLER_KEY: str = Header(None),
    db_session: Session = Depends(get_db),
):
    return delete_seller(db_session, del_seller_id=DEL_ID, seller_key=SELLER_KEY)
