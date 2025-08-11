from uuid import UUID

import asyncpg
from uuid_utils.compat import uuid7

from app.deliveries.exceptions import (
    DeliveryNotFound,
    DeliveryPartnerNotFound,
    InvalidDeliveryRating,
    OrderNotFound,
)
from app.deliveries.models import CreateDelivery, Delivery, UpdateDelivery


class DeliveryRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create(self, delivery: CreateDelivery) -> Delivery:
        query = """
        INSERT INTO deliveries (id, order_id, delivery_partner_id, delivery_type, ratings)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, order_id, delivery_partner_id, delivery_type, ratings
        """
        try:
            row = await self.connection.fetchrow(
                query,
                uuid7(),
                delivery.order_id,
                delivery.delivery_partner_id,
                delivery.delivery_type.value,
                delivery.ratings,
            )
            return Delivery(**row)
        except asyncpg.ForeignKeyViolationError as e:
            if "order" in e.constraint_name:
                raise OrderNotFound(context={"order_id": str(delivery.order_id)})
            elif "delivery_partner" in e.constraint_name:
                raise DeliveryPartnerNotFound(
                    context={"delivery_partner_id": str(delivery.delivery_partner_id)}
                )
            else:
                raise e

    async def list(self) -> list[Delivery]:
        query = """
        SELECT id, order_id, delivery_partner_id, delivery_type, ratings
        FROM deliveries
        ORDER BY id
        """
        rows = await self.connection.fetch(query)
        return [Delivery(**row) for row in rows]

    async def get_by_id(self, delivery_id: UUID) -> Delivery:
        query = """
        SELECT id, order_id, delivery_partner_id, delivery_type, ratings
        FROM deliveries
        WHERE id = $1
        """
        row = await self.connection.fetchrow(query, delivery_id)
        if row:
            return Delivery(**row)
        raise DeliveryNotFound(context={"delivery_id": str(delivery_id)})

    async def get_by_order_id(self, order_id: UUID) -> Delivery:
        query = """
        SELECT id, order_id, delivery_partner_id, delivery_type, ratings
        FROM deliveries
        WHERE order_id = $1
        """
        row = await self.connection.fetchrow(query, order_id)
        if row:
            return Delivery(**row)
        raise DeliveryNotFound(context={"order_id": str(order_id)})

    async def update(self, delivery_id: UUID, delivery: UpdateDelivery) -> Delivery:
        # Validate rating if provided
        if delivery.ratings is not None and (
            delivery.ratings < 1 or delivery.ratings > 5
        ):
            raise InvalidDeliveryRating()

        query = """
        UPDATE deliveries
        SET ratings = $2
        WHERE id = $1
        RETURNING id, order_id, delivery_partner_id, ratings
        """
        row = await self.connection.fetchrow(query, delivery_id, delivery.ratings)
        if row:
            return Delivery(**row)
        raise DeliveryNotFound(context={"delivery_id": str(delivery_id)})
