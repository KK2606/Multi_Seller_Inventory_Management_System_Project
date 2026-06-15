from fastapi import APIRouter, Depends, Header, Request

from db.db_config import Session, get_db
from schemas.inventory_schema import (Add_Inventory_Schema,
                                      Inventory_Response_Schema,
                                      Inventory_with_Seller_Schema,
                                      Update_Inventory_Schema)
from services.inventory_services import (add_product, all_products,
                                         delete_product, search_products,
                                         update_product)

from core.rate_limiter import limiter

inventory_router = APIRouter(prefix="/inventory", tags=["Inventory Management"])

# -----------------------------------------------------------------------------------------------------------------------------------------------


# Show All Products in the Inventory System
# NOTE: This route allows users to view all products in the inventory system.
# TODO: Future updates may include additional features such as pagination, sorting, and filtering to provide a better user experience for users in the system.
@inventory_router.get(
    "/show-all-products",
    response_model=list[Inventory_Response_Schema],
    summary="Show all products in the inventory system",
)
@limiter.limit("50/minute")  # Rate limit: 50 requests per minute for this endpoint
def show_all_items(request: Request, db_session: Session = Depends(get_db)):
    return all_products(db_session=db_session)


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Search for products in the inventory system
# NOTE: This route allows users to search for products based on various criteria, such as ID, name, category, price, stock availability, and seller information.
# TODO: Future updates may introduce fuzzy search capabilities in future updates to enhance the search functionality and provide more relevant results based on partial matches or similar keywords.


@inventory_router.get(
    "/search-products",
    response_model=list[Inventory_with_Seller_Schema],
    summary="Search for products",
)
@limiter.limit("50/minute")  # Rate limit: 50 requests per minute for this endpoint
def search_item(
    request: Request,
    ITEM_ID: int = None,
    ITEM_NAME: str = None,
    ITEM_CATEGORY: str = None,
    ITEM_PRICE: float = None,
    IN_STOCK: bool = None,
    SELLER_ID: str = None,
    SELLER_NAME: str = None,
    db_session: Session = Depends(get_db),
):
    return search_products(
        db_session=db_session,
        Item_ID=ITEM_ID,
        Item_Name=ITEM_NAME,
        Item_Category=ITEM_CATEGORY,
        Item_Price=ITEM_PRICE,
        In_Stock=IN_STOCK,
        Seller_ID=SELLER_ID,
        Seller_Name=SELLER_NAME,
    )


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Add new product to the inventory system
# NOTE: This route allows sellers to add new products to the inventory system by providing the necessary product details and their unique seller key for authentication. The route validates the input data and ensures that only authorized sellers can add products to the system.
# TODO: Future updates may include additional features such as image uploads, product variations, and more advanced validation rules to enhance the product management capabilities for sellers.


@inventory_router.post(
    "/add-product", response_model=Inventory_Response_Schema, summary="Add new product"
)
@limiter.limit("20/minute")  # Rate limit: 20 requests per minute for this endpoint
def add_new_item(
    request: Request,
    add_item_data: Add_Inventory_Schema,
    SELLER_KEY: str = Header(None),
    db_session: Session = Depends(get_db),
):
    # print("HEADER RECEIVED:", SELLER_KEY) # Debugging statement to check if the header is received correctly
    return add_product(db_session, add_item_data, seller_key=SELLER_KEY)


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Update existing product in the inventory system
# NOTE: This route allows sellers to update the details of their existing products in the inventory system by providing the product ID, updated product data, and their unique seller key for authentication. The route validates the input data and ensures that only authorized sellers can update their products in the system.
# TODO: Future updates may include updating product images, product variations, and more advanced validation rules to enhance the product management capabilities for sellers.


@inventory_router.put(
    "/update-product",
    response_model=Inventory_Response_Schema,
    summary="Update existing product",
)
@limiter.limit("20/minute")  # Rate limit: 20 requests per minute for this endpoint
def update_existing_item(
    request: Request,
    update_item_data: Update_Inventory_Schema,
    ITEM_ID: int,
    SELLER_KEY: str = Header(None),
    db_session: Session = Depends(get_db),
):
    return update_product(
        db_session,
        seller_key=SELLER_KEY,
        update_item_id=ITEM_ID,
        update_item_data=update_item_data,
    )


# -----------------------------------------------------------------------------------------------------------------------------------------------

# Delete existing product from the inventory system
# NOTE: This route allows sellers to delete their existing products from the inventory system by providing the product ID and their unique seller key for authentication. The route validates the input data and ensures that only authorized sellers can delete their products from the system.
# TODO: Future updates may include additional features such as product recovery or archiving to provide a better user experience for sellers.


@inventory_router.delete(
    "/delete-product", summary="Delete existing product"
)  # Delete Existing Product
@limiter.limit("20/minute")  # Rate limit: 20 requests per minute for this endpoint
def delete_existing_item(
    request: Request,
    DEL_ID: int = None,
    SELLER_KEY: str = Header(None),
    db_session: Session = Depends(get_db),
):
    return delete_product(db_session, del_item_id=DEL_ID, seller_key=SELLER_KEY)
