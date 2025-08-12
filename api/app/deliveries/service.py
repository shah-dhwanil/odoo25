from uuid import UUID

from app.deliveries.exceptions import InvalidDeliveryRating
from app.deliveries.models import CreateDelivery, Delivery, UpdateDelivery
from app.deliveries.repository import DeliveryRepository


class DeliveryService:
    def __init__(self, repository: DeliveryRepository):
        self.repository = repository

    async def create_delivery(self, delivery_data: CreateDelivery) -> Delivery:
        """Create a new delivery."""
        # Validate rating if provided
        if delivery_data.ratings is not None and (
            delivery_data.ratings < 1 or delivery_data.ratings > 5
        ):
            raise InvalidDeliveryRating()

        return await self.repository.create(delivery_data)

    async def get_deliveries(self) -> list[Delivery]:
        """Get all deliveries."""
        return await self.repository.list()

    async def get_delivery(self, delivery_id: UUID) -> Delivery:
        """Get a delivery by ID."""
        return await self.repository.get_by_id(delivery_id)

    async def get_delivery_by_order(self, order_id: UUID) -> list[Delivery]:
        """Get a delivery by order ID."""
        return await self.repository.get_by_order_id(order_id)

    async def update_delivery(
        self, delivery_id: UUID, delivery_data: UpdateDelivery
    ) -> Delivery:
        """Update an existing delivery."""
        # Validate rating if provided
        if delivery_data.ratings is not None and (
            delivery_data.ratings < 1 or delivery_data.ratings > 5
        ):
            raise InvalidDeliveryRating()

        return await self.repository.update(delivery_id, delivery_data)
