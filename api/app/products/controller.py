from typing import Optional
from uuid import UUID

import asyncpg
from fastapi import APIRouter, Depends, Query, UploadFile, status
from uuid_utils import uuid7

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.database import PgPool
from app.minio import MinioClient
from app.products.exceptions import (
    InsufficientQuantity,
    InvalidPriceConfiguration,
    InvalidRentalUnit,
    ProductAlreadyExists,
    ProductDeleted,
    ProductNotFound,
    ProductOwnerMismatch,
)
from app.products.models import (
    CreateProduct,
    ListProduct,
    Product,
    RentalUnit,
    UpdateProduct,
)
from app.products.service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


async def get_product_service(
    connection: asyncpg.Connection = Depends(PgPool.get_connection),
) -> ProductService:
    """Dependency to get ProductService with database connection"""
    try:
        yield ProductService(connection)
    finally:
        await connection.close()


@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: CreateProduct,
    service: ProductService = Depends(get_product_service),
) -> Product:
    """Create a new product."""
    try:
        return await service.create_product(product_data)
    except ProductAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )
    except InvalidPriceConfiguration as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )
    except InsufficientQuantity as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.get("/", response_model=ListProduct)
async def get_products(
    owner_id: Optional[UUID] = Query(None, description="Filter by owner ID"),
    category_id: Optional[UUID] = Query(None, description="Filter by category ID"),
    service: ProductService = Depends(get_product_service),
) -> ListProduct:
    """Get all products with optional filtering."""
    products = await service.list_products(owner_id=owner_id, category_id=category_id)
    return ListProduct(products=products)


@router.get("/search", response_model=ListProduct)
async def search_products(
    q: str = Query(..., description="Search term"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of results"),
    service: ProductService = Depends(get_product_service),
) -> ListProduct:
    """Search products by name."""
    products = await service.search_products(q, limit)
    return ListProduct(products=products)


@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: UUID, service: ProductService = Depends(get_product_service)
) -> Product:
    """Get a product by ID."""
    try:
        return await service.get_product(product_id)
    except ProductNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except ProductDeleted as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_410_GONE,
                error=e,
            )
        )


@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: UUID,
    product_data: UpdateProduct,
    requester_owner_id: UUID = Query(..., description="Owner ID of the requester"),
    service: ProductService = Depends(get_product_service),
) -> Product:
    """Update an existing product."""
    try:
        return await service.update_product(
            product_id, product_data, requester_owner_id
        )
    except ProductNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except ProductDeleted as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_410_GONE,
                error=e,
            )
        )
    except ProductAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )
    except ProductOwnerMismatch as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                error=e,
            )
        )
    except InvalidPriceConfiguration as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )
    except InsufficientQuantity as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: UUID, service: ProductService = Depends(get_product_service)
) -> None:
    """Delete a product (soft delete)."""
    try:
        await service.delete_product(product_id)
    except ProductNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except ProductDeleted as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_410_GONE,
                error=e,
            )
        )
    except ProductOwnerMismatch as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                error=e,
            )
        )
    except InsufficientQuantity as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.post("/{product_id}/confirm-rental", response_model=Product)
async def confirm_rental(
    product_id: UUID,
    quantity: int = Query(..., ge=1, description="Quantity to confirm rental"),
    service: ProductService = Depends(get_product_service),
) -> Product:
    """Confirm rental and move quantity from reserved to rented."""
    try:
        return await service.confirm_rental(product_id, quantity)
    except ProductNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InsufficientQuantity as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.post("/{product_id}/return", response_model=Product)
async def return_rental(
    product_id: UUID,
    quantity: int = Query(..., ge=1, description="Quantity to return"),
    service: ProductService = Depends(get_product_service),
) -> Product:
    """Return rented quantity back to available."""
    try:
        return await service.return_rental(product_id, quantity)
    except ProductNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InsufficientQuantity as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.get("/{product_id}/price/{rental_unit}", response_model=dict)
async def get_price_for_rental_unit(
    product_id: UUID,
    rental_unit: RentalUnit,
    service: ProductService = Depends(get_product_service),
) -> dict:
    """Get price for a specific rental unit."""
    try:
        price = await service.get_price_for_rental_unit(product_id, rental_unit)
        return {
            "product_id": product_id,
            "rental_unit": rental_unit.value,
            "price": price,
        }
    except ProductNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InvalidRentalUnit as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.post("/upload_images")
async def upload_images(
    file: UploadFile,
):
    file_id = str(uuid7())
    client = MinioClient.get_client()
    await client.put_object(
        bucket_name="products",
        object_name=file_id,
        data=file,
        length=file.size,
        content_type=file.content_type,
        metadata={
            "file_name": file.filename,
        },
    )
    return {"id": file_id}
