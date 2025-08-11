import json
from datetime import datetime
from uuid import UUID

import asyncpg
from uuid_utils.compat import uuid7

from app.base.schemas import Address
from app.orders.exceptions import InvalidRentDates, OrderNotFound
from app.orders.models import (
    Amount,
    CreateOrder,
    ListOrder,
    Order,
    OrderStatus,
    PaymentStatus,
    UpdateAmountPaid,
    UpdateDeliveryPhotoId,
    UpdateOrderStatus,
    UpdatePaymentStatus,
    UpdatePickupPhotoId,
    UpdateRatings,
)


class OrderRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create(self, order_data: CreateOrder, amt: Amount) -> Order:
        """Create a new order"""
        # Validate rent dates
        if order_data.rent_start_date >= order_data.rent_end_date:
            raise InvalidRentDates()

        query = """
        INSERT INTO orders (
            id, user_id, product_id, quantity, rent_start_date, rent_end_date,
            delivery_location, pickup_location, delivery_date, pickup_date,
            amount, amount_paid, amount_due, order_status, payment_status,
            delivery_photo_id, pickup_photo_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
        """

        row = await self.connection.fetchrow(
            query,
            uuid7(),
            order_data.user_id,
            order_data.product_id,
            order_data.quantity,
            order_data.rent_start_date,
            order_data.rent_end_date,
            order_data.delivery_location.model_dump_json(),
            order_data.pickup_location.model_dump_json(),
            order_data.delivery_date,
            order_data.pickup_date,
            amt.model_dump_json(),
            0.00,
            amt.total,
            order_data.order_status.value,
            order_data.payment_status.value,
            [],
            [],
        )

        return self._row_to_order(row)

    async def list(self, limit: int = 100, offset: int = 0) -> ListOrder:
        """List all orders with pagination"""
        query = """
        SELECT * FROM orders 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
        """
        rows = await self.connection.fetch(query, limit, offset)
        orders = [self._row_to_order(row) for row in rows]
        return ListOrder(orders=orders)

    async def get_by_id(self, order_id: UUID) -> Order:
        """Get order by ID"""
        query = "SELECT * FROM orders WHERE id = $1"
        row = await self.connection.fetchrow(query, order_id)
        if not row:
            raise OrderNotFound(context={"order_id": str(order_id)})

        return self._row_to_order(row)

    async def get_by_user_id(
        self, user_id: UUID, limit: int = 100, offset: int = 0
    ) -> ListOrder:
        """Get orders by user ID with pagination"""
        query = """
        SELECT * FROM orders 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
        """
        rows = await self.connection.fetch(query, user_id, limit, offset)
        orders = [self._row_to_order(row) for row in rows]
        return ListOrder(orders=orders)

    async def get_by_product_id(
        self, product_id: UUID, limit: int = 100, offset: int = 0
    ) -> ListOrder:
        """Get orders by product ID"""
        query = """
        SELECT * FROM orders 
        WHERE product_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
        """
        rows = await self.connection.fetch(query, product_id, limit, offset)
        orders = [self._row_to_order(row) for row in rows]
        return ListOrder(orders=orders)

    async def get_by_status(
        self, status: OrderStatus, limit: int = 100, offset: int = 0
    ) -> ListOrder:
        """Get orders by status"""
        query = """
        SELECT * FROM orders 
        WHERE order_status = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
        """
        rows = await self.connection.fetch(query, status.value, limit, offset)
        orders = [self._row_to_order(row) for row in rows]
        return ListOrder(orders=orders)

    async def update_amount_paid(
        self, order_id: UUID, update_data: UpdateAmountPaid
    ) -> Order:
        """Update amount paid for an order"""
        query = """
        UPDATE orders 
        SET amount_paid = $1, amount_due = amount_due - $1, updated_at = $2
        WHERE id = $3 
        RETURNING *
        """
        row = await self.connection.fetchrow(
            query, update_data.amount_paid, datetime.utcnow(), order_id
        )
        if not row:
            raise OrderNotFound(context={"order_id": str(order_id)})

        return self._row_to_order(row)

    async def update_order_status(
        self, order_id: UUID, update_data: UpdateOrderStatus
    ) -> Order:
        """Update order status"""
        query = """
        UPDATE orders 
        SET order_status = $1, updated_at = $2
        WHERE id = $3 
        RETURNING *
        """
        row = await self.connection.fetchrow(
            query, update_data.order_status.value, datetime.utcnow(), order_id
        )
        if not row:
            raise OrderNotFound(context={"order_id": str(order_id)})

        return self._row_to_order(row)

    async def update_payment_status(
        self, order_id: UUID, update_data: UpdatePaymentStatus
    ) -> Order:
        """Update payment status"""
        query = """
        UPDATE orders 
        SET payment_status = $1, updated_at = $2
        WHERE id = $3 
        RETURNING *
        """
        row = await self.connection.fetchrow(
            query, update_data.payment_status.value, datetime.utcnow(), order_id
        )
        if not row:
            raise OrderNotFound(context={"order_id": str(order_id)})

        return self._row_to_order(row)

    async def update_delivery_photo_id(
        self, order_id: UUID, update_data: UpdateDeliveryPhotoId
    ) -> Order:
        """Update delivery photo IDs"""
        query = """
        UPDATE orders 
        SET delivery_photo_id = $1, updated_at = $2
        WHERE id = $3 
        RETURNING *
        """
        row = await self.connection.fetchrow(
            query, update_data.delivery_photo_id, datetime.utcnow(), order_id
        )
        if not row:
            raise OrderNotFound(context={"order_id": str(order_id)})

        return self._row_to_order(row)

    async def update_pickup_photo_id(
        self, order_id: UUID, update_data: UpdatePickupPhotoId
    ) -> Order:
        """Update pickup photo IDs"""
        query = """
        UPDATE orders 
        SET pickup_photo_id = $1, updated_at = $2
        WHERE id = $3 
        RETURNING *
        """
        row = await self.connection.fetchrow(
            query, update_data.pickup_photo_id, datetime.utcnow(), order_id
        )
        if not row:
            raise OrderNotFound(context={"order_id": str(order_id)})

        return self._row_to_order(row)

    async def update_ratings(self, order_id: UUID, update_data: UpdateRatings) -> Order:
        """Update order ratings"""
        query = """
        UPDATE orders 
        SET ratings = $1, updated_at = $2
        WHERE id = $3 
        RETURNING *
        """
        row = await self.connection.fetchrow(
            query, update_data.ratings, datetime.utcnow(), order_id
        )
        if not row:
            raise OrderNotFound(context={"order_id": str(order_id)})

        return self._row_to_order(row)

    async def delete(self, order_id: UUID) -> None:
        """Delete an order (hard delete)"""
        query = "DELETE FROM orders WHERE id = $1"
        result = await self.connection.execute(query, order_id)
        if result == "DELETE 0":
            raise OrderNotFound(context={"order_id": str(order_id)})

    def _row_to_order(self, row: asyncpg.Record) -> Order:
        """Convert database row to Order model"""
        return Order(
            id=row["id"],
            user_id=row["user_id"],
            product_id=row["product_id"],
            quantity=row["quantity"],
            rent_start_date=row["rent_start_date"],
            rent_end_date=row["rent_end_date"],
            delivery_location=Address(**json.loads(row["delivery_location"])),
            pickup_location=Address(**json.loads(row["pickup_location"])),
            delivery_date=row["delivery_date"],
            pickup_date=row["pickup_date"],
            amount=Amount(**json.loads(row["amount"])),
            amount_paid=float(row["amount_paid"]),
            amount_due=float(row["amount_due"]),
            order_status=OrderStatus(row["order_status"]),
            payment_status=PaymentStatus(row["payment_status"]),
            delivery_photo_id=list(row["delivery_photo_id"])
            if row["delivery_photo_id"]
            else [],
            pickup_photo_id=list(row["pickup_photo_id"])
            if row["pickup_photo_id"]
            else [],
            ratings=row["ratings"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
