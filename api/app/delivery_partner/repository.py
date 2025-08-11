from uuid import UUID

import asyncpg

from app.base.schemas import Address
from app.delivery_partner.exceptions import (
    DeliveryPartnerAlreadyExists,
    DeliveryPartnerNotFound,
)
from app.delivery_partner.models import (
    CreateDeliveryPartner,
    DeliveryPartner,
    UpdateDeliveryPartner,
)


class DeliveryPartnerRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create(self, delivery_partner: CreateDeliveryPartner) -> DeliveryPartner:
        query = """
        INSERT INTO delivery_partners (id, name, address)
        VALUES ($1, $2, $3)
        RETURNING id, name, address, is_deleted, created_at
        """
        try:
            row = await self.connection.fetchrow(
                query,
                delivery_partner.id,
                delivery_partner.name,
                delivery_partner.address.model_dump_json(),
            )
            return DeliveryPartner(
                id=row["id"],
                name=row["name"],
                address=Address.model_validate_json(row["address"]),
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        except asyncpg.UniqueViolationError:
            raise DeliveryPartnerAlreadyExists(context={"id": str(delivery_partner.id)})
        except asyncpg.ForeignKeyViolationError:
            raise DeliveryPartnerNotFound(
                context={
                    "id": str(delivery_partner.id),
                    "msg": "User not found with given id",
                }
            )

    async def list(self) -> list[DeliveryPartner]:
        query = """
        SELECT id, name, address, is_deleted, created_at
        FROM delivery_partners
        WHERE is_deleted = FALSE
        """
        rows = await self.connection.fetch(query)
        return [
            DeliveryPartner(
                id=row["id"],
                name=row["name"],
                address=Address.model_validate_json(row["address"]),
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
            for row in rows
        ]

    async def get_by_id(self, delivery_partner_id: UUID) -> DeliveryPartner:
        query = """
        SELECT id, name, address, is_deleted, created_at
        FROM delivery_partners
        WHERE id = $1 AND is_deleted = FALSE
        """
        row = await self.connection.fetchrow(query, delivery_partner_id)
        if row:
            return DeliveryPartner(
                id=row["id"],
                name=row["name"],
                address=Address.model_validate_json(row["address"]),
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        raise DeliveryPartnerNotFound(
            context={"delivery_partner_id": str(delivery_partner_id)}
        )

    async def update(
        self, id: UUID, delivery_partner: UpdateDeliveryPartner
    ) -> DeliveryPartner:
        query = """
        UPDATE delivery_partners
        SET name = $2, address = $3
        WHERE id = $1 AND is_deleted = FALSE
        RETURNING id, name, address, is_deleted, created_at
        """
        row = await self.connection.fetchrow(
            query,
            id,
            delivery_partner.name,
            delivery_partner.address.model_dump_json(),
        )
        if row:
            return DeliveryPartner(
                id=row["id"],
                name=row["name"],
                address=Address.model_validate_json(row["address"]),
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        raise DeliveryPartnerNotFound(context={"delivery_partner_id": str(id)})

    async def delete(self, delivery_partner_id: UUID) -> None:
        query = """
        UPDATE users
        SET is_deleted = TRUE
        WHERE id = $1
        """
        result = await self.connection.execute(query, delivery_partner_id)
        if result == "UPDATE 0":
            raise DeliveryPartnerNotFound(
                context={"delivery_partner_id": str(delivery_partner_id)}
            )
