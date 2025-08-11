from uuid import UUID

import asyncpg
from fastapi import APIRouter, Depends, status

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.database import PgPool
from app.deliveries.exceptions import (
    DeliveryAlreadyExists,
    DeliveryNotFound,
    DeliveryPartnerNotFound,
    InvalidDeliveryRating,
    OrderNotFound,
)
from app.deliveries.models import CreateDelivery, Delivery, ListDelivery, UpdateDelivery
from app.deliveries.repository import DeliveryRepository
from app.deliveries.service import DeliveryService

router = APIRouter(prefix="/deliveries", tags=["deliveries"])


async def get_delivery_service(
    connection: asyncpg.Connection = Depends(PgPool.get_connection),
) -> DeliveryService:
    """Dependency to get DeliveryService with database connection"""
    try:
        repository = DeliveryRepository(connection)
        yield DeliveryService(repository)
    finally:
        await connection.close()


@router.post("/", response_model=Delivery, status_code=status.HTTP_201_CREATED)
async def create_delivery(
    delivery_data: CreateDelivery,
    service: DeliveryService = Depends(get_delivery_service),
) -> Delivery:
    """Create a new delivery."""
    try:
        return await service.create_delivery(delivery_data)
    except DeliveryAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )
    except InvalidDeliveryRating as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )
    except (OrderNotFound, DeliveryPartnerNotFound) as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.get("/", response_model=ListDelivery)
async def get_deliveries(
    service: DeliveryService = Depends(get_delivery_service),
) -> ListDelivery:
    """Get all deliveries."""
    deliveries = await service.get_deliveries()
    return ListDelivery(deliveries=deliveries)


@router.get("/{delivery_id}", response_model=Delivery)
async def get_delivery(
    delivery_id: UUID, service: DeliveryService = Depends(get_delivery_service)
) -> Delivery:
    """Get a delivery by ID."""
    try:
        return await service.get_delivery(delivery_id)
    except DeliveryNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.get("/order/{order_id}", response_model=Delivery)
async def get_delivery_by_order(
    order_id: UUID, service: DeliveryService = Depends(get_delivery_service)
) -> Delivery:
    """Get a delivery by order ID."""
    try:
        return await service.get_delivery_by_order(order_id)
    except DeliveryNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.put("/{delivery_id}", response_model=Delivery)
async def update_delivery(
    delivery_id: UUID,
    delivery_data: UpdateDelivery,
    service: DeliveryService = Depends(get_delivery_service),
) -> Delivery:
    """Update an existing delivery."""
    try:
        return await service.update_delivery(delivery_id, delivery_data)
    except DeliveryNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InvalidDeliveryRating as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )
