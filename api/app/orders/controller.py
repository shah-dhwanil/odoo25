from uuid import UUID

import asyncpg
from fastapi import APIRouter, Depends, Query, status

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.database import PgPool
from app.orders.exceptions import (
    InsufficientPayment,
    InsufficientStock,
    InvalidDeliveryDates,
    InvalidOrderStatus,
    InvalidPaymentStatus,
    InvalidRentDates,
    OrderNotCancellable,
    OrderNotFound,
    ProductNotAvailable,
)
from app.orders.models import (
    CreateOrder,
    ListOrder,
    Order,
    OrderStatus,
    UpdateAmountPaid,
    UpdateDeliveryPhotoId,
    UpdateOrderStatus,
    UpdatePaymentStatus,
    UpdatePickupPhotoId,
    UpdateRatings,
)
from app.orders.repository import OrderRepository
from app.orders.service import OrderService

router = APIRouter(prefix="/orders", tags=["orders"])


async def get_order_service(
    connection: asyncpg.Connection = Depends(PgPool.get_connection),
) -> OrderService:
    """Dependency to get OrderService with database connection"""
    try:
        repository = OrderRepository(connection)
        yield OrderService(repository)
    finally:
        await connection.close()


@router.post("/", response_model=Order, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: CreateOrder,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Create a new order."""
    try:
        return await service.create_order(order_data)
    except (
        InsufficientStock,
        InvalidRentDates,
        InvalidDeliveryDates,
        ProductNotAvailable,
    ) as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.get("/", response_model=ListOrder)
async def get_orders(
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    service: OrderService = Depends(get_order_service),
) -> ListOrder:
    """Get all orders with pagination."""
    return await service.get_orders(limit=limit, offset=offset)


@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: UUID, service: OrderService = Depends(get_order_service)
) -> Order:
    """Get an order by ID."""
    try:
        return await service.get_order(order_id)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.get("/users/{user_id}", response_model=ListOrder)
async def get_orders_by_user(
    user_id: UUID,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    service: OrderService = Depends(get_order_service),
) -> ListOrder:
    """Get orders for a specific user."""
    return await service.get_orders_by_user(user_id, limit=limit, offset=offset)


@router.get("/products/{product_id}", response_model=ListOrder)
async def get_orders_by_product(
    product_id: UUID,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    service: OrderService = Depends(get_order_service),
) -> ListOrder:
    """Get orders for a specific product."""
    return await service.get_orders_by_product(product_id, limit=limit, offset=offset)


@router.get("/status/{status}", response_model=ListOrder)
async def get_orders_by_status(
    status: OrderStatus,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    service: OrderService = Depends(get_order_service),
) -> ListOrder:
    """Get orders by status."""
    return await service.get_orders_by_status(status, limit=limit, offset=offset)


@router.patch("/{order_id}/status", response_model=Order)
async def update_order_status(
    order_id: UUID,
    update_data: UpdateOrderStatus,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Update order status."""
    try:
        return await service.update_order_status(order_id, update_data)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InvalidOrderStatus as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.patch("/{order_id}/payment-status", response_model=Order)
async def update_payment_status(
    order_id: UUID,
    update_data: UpdatePaymentStatus,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Update payment status."""
    try:
        return await service.update_payment_status(order_id, update_data)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InvalidPaymentStatus as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.patch("/{order_id}/payment", response_model=Order)
async def update_amount_paid(
    order_id: UUID,
    update_data: UpdateAmountPaid,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Update amount paid for an order."""
    try:
        return await service.update_amount_paid(order_id, update_data)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InsufficientPayment as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.patch("/{order_id}/pickup-complete", response_model=Order)
async def complete_pickup(
    order_id: UUID,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Mark an order as picked up."""
    try:
        return await service.pickup_complete(order_id)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InsufficientPayment as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )
    except InvalidOrderStatus as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.patch("/{order_id}/delivery-photos", response_model=Order)
async def update_delivery_photos(
    order_id: UUID,
    update_data: UpdateDeliveryPhotoId,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Update delivery photo IDs."""
    try:
        return await service.update_delivery_photos(order_id, update_data)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.patch("/{order_id}/pickup-photos", response_model=Order)
async def update_pickup_photos(
    order_id: UUID,
    update_data: UpdatePickupPhotoId,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Update pickup photo IDs."""
    try:
        return await service.update_pickup_photos(order_id, update_data)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.patch("/{order_id}/ratings", response_model=Order)
async def update_ratings(
    order_id: UUID,
    update_data: UpdateRatings,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Update order ratings."""
    try:
        return await service.update_ratings(order_id, update_data)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except InvalidOrderStatus as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )


@router.patch("/{order_id}/cancel", response_model=Order)
async def cancel_order(
    order_id: UUID,
    service: OrderService = Depends(get_order_service),
) -> Order:
    """Cancel an order."""
    try:
        return await service.cancel_order(order_id)
    except OrderNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except OrderNotCancellable as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=e,
            )
        )
