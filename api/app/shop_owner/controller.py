from uuid import UUID

import asyncpg
from fastapi import APIRouter, Depends, status

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.database import PgPool
from app.shop_owner.exceptions import (
    ShopOwnerAlreadyExists,
    ShopOwnerGSTAlreadyExists,
    ShopOwnerNotFound,
)
from app.shop_owner.models import (
    CreateShopOwner,
    ListShopOwner,
    ShopOwner,
    UpdateShopOwner,
)
from app.shop_owner.repository import ShopOwnerRepository
from app.shop_owner.service import ShopOwnerService

router = APIRouter(prefix="/shop-owners", tags=["shop-owners"])


async def get_shop_owner_service(
    connection: asyncpg.Connection = Depends(PgPool.get_connection),
) -> ShopOwnerService:
    """Dependency to get ShopOwnerService with database connection"""
    try:
        repository = ShopOwnerRepository(connection)
        yield ShopOwnerService(repository)
    finally:
        await connection.close()


@router.post("/", response_model=ShopOwner, status_code=status.HTTP_201_CREATED)
async def create_shop_owner(
    shop_owner_data: CreateShopOwner,
    service: ShopOwnerService = Depends(get_shop_owner_service),
) -> ShopOwner:
    """Create a new shop owner."""
    try:
        return await service.create_shop_owner(shop_owner_data)
    except ShopOwnerAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )
    except ShopOwnerGSTAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )


@router.get("/", response_model=ListShopOwner)
async def get_shop_owners(
    service: ShopOwnerService = Depends(get_shop_owner_service),
) -> ListShopOwner:
    """Get all shop owners."""
    return await service.list_shop_owners()


@router.get("/{shop_owner_id}", response_model=ShopOwner)
async def get_shop_owner(
    shop_owner_id: UUID, service: ShopOwnerService = Depends(get_shop_owner_service)
) -> ShopOwner:
    """Get a shop owner by ID."""
    try:
        return await service.get_shop_owner_by_id(shop_owner_id)
    except ShopOwnerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.get("/gst/{gst_no}", response_model=ShopOwner)
async def get_shop_owner_by_gst(
    gst_no: str, service: ShopOwnerService = Depends(get_shop_owner_service)
) -> ShopOwner:
    """Get a shop owner by GST number."""
    try:
        return await service.get_shop_owner_by_gst(gst_no)
    except ShopOwnerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.put("/{shop_owner_id}", response_model=ShopOwner)
async def update_shop_owner(
    shop_owner_id: UUID,
    shop_owner_data: UpdateShopOwner,
    service: ShopOwnerService = Depends(get_shop_owner_service),
) -> ShopOwner:
    """Update an existing shop owner."""
    try:
        return await service.update_shop_owner(shop_owner_id, shop_owner_data)
    except ShopOwnerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except ShopOwnerGSTAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )


@router.delete("/{shop_owner_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shop_owner(
    shop_owner_id: UUID, service: ShopOwnerService = Depends(get_shop_owner_service)
) -> None:
    """Delete a shop owner (soft delete)."""
    try:
        await service.delete_shop_owner(shop_owner_id)
    except ShopOwnerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
