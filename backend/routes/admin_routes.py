# Admin Routes for the Inventory Management System Backend Service
# This file defines the API routes for admin-related operations, such as viewing all sellers and their products
# The admin routes are protected and require an admin key for authentication to ensure that only authorized users can access sensitive information

from fastapi import APIRouter, Depends, Header, Request

from db.db_config import Session, get_db
from schemas.admin_schema import Admin_Response_Schema
from services.admin_service import show_all_sellers_with_products
from core.rate_limiter import limiter

admin_router = APIRouter(prefix="/admin", tags=["Admin"])

# Route to show all sellers with their products (admin-only access)
# NOTE: This route allows admin users to view all sellers in the system along with their associated products and seller keys. The route requires an admin key for authentication to ensure that only authorized users can access this sensitive information.


@admin_router.get(
    "/admin_dashboard",
    response_model=list[Admin_Response_Schema],
    summary="Show all sellers with their products (admin-only access)",
)
@limiter.limit("5/minute")  # Rate limit: 5 requests per minute for this endpoint
def get_admin_dashboard(
    request: Request,
    db_session: Session = Depends(get_db), Admin_Key: str = Header(None)
):
    return show_all_sellers_with_products(db_session=db_session, admin_key=Admin_Key)
