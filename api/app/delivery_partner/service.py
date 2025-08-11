from uuid import UUID

from app.delivery_partner.models import (
    CreateDeliveryPartner,
    DeliveryPartner,
    ListDeliveryPartner,
    UpdateDeliveryPartner,
)
from app.delivery_partner.repository import DeliveryPartnerRepository


class DeliveryPartnerService:
    def __init__(self, repository: DeliveryPartnerRepository):
        self.repository = repository

    async def create_delivery_partner(
        self, delivery_partner: CreateDeliveryPartner
    ) -> DeliveryPartner:
        """Create a new delivery partner."""
        return await self.repository.create(delivery_partner)

    async def get_delivery_partners(self) -> ListDeliveryPartner:
        """Get all active delivery partners."""
        delivery_partners = await self.repository.list()
        return ListDeliveryPartner(delivery_partners=delivery_partners)

    async def get_delivery_partner_by_id(
        self, delivery_partner_id: UUID
    ) -> DeliveryPartner:
        """Get a delivery partner by ID."""
        return await self.repository.get_by_id(delivery_partner_id)

    async def update_delivery_partner(
        self, delivery_partner_id: UUID, delivery_partner: UpdateDeliveryPartner
    ) -> DeliveryPartner:
        """Update an existing delivery partner."""
        return await self.repository.update(delivery_partner_id, delivery_partner)

    async def delete_delivery_partner(self, delivery_partner_id: UUID) -> None:
        """Soft delete a delivery partner."""
        await self.repository.delete(delivery_partner_id)
