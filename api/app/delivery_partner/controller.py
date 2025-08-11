from uuid import UUID

import asyncpg
from fastapi import APIRouter, Depends, status

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.database import PgPool
from app.delivery_partner.exceptions import (
    DeliveryPartnerAlreadyExists,
    DeliveryPartnerNotFound,
)
from app.delivery_partner.models import (
    CreateDeliveryPartner,
    DeliveryPartner,
    ListDeliveryPartner,
    UpdateDeliveryPartner,
)
from app.delivery_partner.repository import DeliveryPartnerRepository
from app.delivery_partner.service import DeliveryPartnerService

router = APIRouter(prefix="/delivery-partners", tags=["delivery-partners"])


async def get_delivery_partner_service(
    connection: asyncpg.Connection = Depends(PgPool.get_connection),
) -> DeliveryPartnerService:
    """Dependency to get DeliveryPartnerService with database connection"""
    try:
        repository = DeliveryPartnerRepository(connection)
        yield DeliveryPartnerService(repository)
    finally:
        await connection.close()


@router.post("/", response_model=DeliveryPartner, status_code=status.HTTP_201_CREATED)
async def create_delivery_partner(
    delivery_partner_data: CreateDeliveryPartner,
    service: DeliveryPartnerService = Depends(get_delivery_partner_service),
) -> DeliveryPartner:
    """Create a new delivery partner."""
    try:
        return await service.create_delivery_partner(delivery_partner_data)
    except DeliveryPartnerAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )


@router.get("/", response_model=ListDeliveryPartner)
async def get_delivery_partners(
    service: DeliveryPartnerService = Depends(get_delivery_partner_service),
) -> ListDeliveryPartner:
    """Get all delivery partners."""
    return await service.get_delivery_partners()


@router.get("/{delivery_partner_id}", response_model=DeliveryPartner)
async def get_delivery_partner(
    delivery_partner_id: UUID,
    service: DeliveryPartnerService = Depends(get_delivery_partner_service),
) -> DeliveryPartner:
    """Get a delivery partner by ID."""
    try:
        return await service.get_delivery_partner_by_id(delivery_partner_id)
    except DeliveryPartnerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.put("/{delivery_partner_id}", response_model=DeliveryPartner)
async def update_delivery_partner(
    delivery_partner_id: UUID,
    delivery_partner_data: UpdateDeliveryPartner,
    service: DeliveryPartnerService = Depends(get_delivery_partner_service),
) -> DeliveryPartner:
    """Update an existing delivery partner."""
    try:
        return await service.update_delivery_partner(
            delivery_partner_id, delivery_partner_data
        )
    except DeliveryPartnerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.delete("/{delivery_partner_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_delivery_partner(
    delivery_partner_id: UUID,
    service: DeliveryPartnerService = Depends(get_delivery_partner_service),
) -> None:
    """Delete a delivery partner (soft delete)."""
    try:
        await service.delete_delivery_partner(delivery_partner_id)
    except DeliveryPartnerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
