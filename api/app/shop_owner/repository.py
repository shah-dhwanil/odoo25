from uuid import UUID

import asyncpg

from app.shop_owner.exceptions import (
    ShopOwnerAlreadyExists,
    ShopOwnerGSTAlreadyExists,
    ShopOwnerNotFound,
)
from app.shop_owner.models import (
    Address,
    BankDetails,
    CreateShopOwner,
    ShopOwner,
    UpdateShopOwner,
)


class ShopOwnerRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create(self, shop_owner: CreateShopOwner) -> ShopOwner:
        query = """
        INSERT INTO shop_owner (id, name, owner_name, gst_no, address, bank_details)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, owner_name, gst_no, address, bank_details, created_at
        """
        try:
            row = await self.connection.fetchrow(
                query,
                shop_owner.id,
                shop_owner.name,
                shop_owner.owner_name,
                shop_owner.gst_no,
                shop_owner.address.model_dump_json(),
                shop_owner.bank_details.model_dump_json(),
            )
            return ShopOwner(
                id=row["id"],
                name=row["name"],
                owner_name=row["owner_name"],
                gst_no=row["gst_no"],
                address=Address.model_validate_json(row["address"]),
                bank_details=BankDetails.model_validate_json(row["bank_details"]),
                created_at=row["created_at"],
            )
        except asyncpg.UniqueViolationError:
            raise ShopOwnerAlreadyExists(context={"gst_no": shop_owner.gst_no})
        except asyncpg.ForeignKeyViolationError:
            raise ShopOwnerNotFound(
                context={
                    "id": str(shop_owner.id),
                    "msg": "User not found with given id",
                }
            )

    async def list(self) -> list[ShopOwner]:
        query = """
        SELECT id, name, owner_name, gst_no, address, bank_details, created_at
        FROM shop_owner
        WHERE is_deleted = FALSE
        """
        rows = await self.connection.fetch(query)
        return [
            ShopOwner(
                id=row["id"],
                name=row["name"],
                owner_name=row["owner_name"],
                gst_no=row["gst_no"],
                address=Address.model_validate_json(row["address"]),
                bank_details=BankDetails.model_validate_json(row["bank_details"]),
                created_at=row["created_at"],
            )
            for row in rows
        ]

    async def get_by_id(self, shop_owner_id: UUID) -> ShopOwner:
        query = """
        SELECT id, name, owner_name, gst_no, address, bank_details, created_at
        FROM shop_owner
        WHERE id = $1 AND is_deleted = FALSE
        """
        row = await self.connection.fetchrow(query, shop_owner_id)
        if row:
            return ShopOwner(
                id=row["id"],
                name=row["name"],
                owner_name=row["owner_name"],
                gst_no=row["gst_no"],
                address=Address.model_validate_json(row["address"]),
                bank_details=BankDetails.model_validate_json(row["bank_details"]),
                created_at=row["created_at"],
            )
        raise ShopOwnerNotFound(context={"shop_owner_id": str(shop_owner_id)})

    async def get_by_gst_no(self, gst_no: str) -> ShopOwner:
        query = """
        SELECT id, name, owner_name, gst_no, address, bank_details, created_at
        FROM shop_owner
        WHERE gst_no = $1 AND is_deleted = FALSE
        """
        row = await self.connection.fetchrow(query, gst_no)
        if row:
            return ShopOwner(
                id=row["id"],
                name=row["name"],
                owner_name=row["owner_name"],
                gst_no=row["gst_no"],
                address=Address.model_validate_json(row["address"]),
                bank_details=BankDetails.model_validate_json(row["bank_details"]),
                created_at=row["created_at"],
            )
        raise ShopOwnerNotFound(context={"gst_no": gst_no})

    async def update(self, id: UUID, shop_owner: UpdateShopOwner) -> ShopOwner:
        query = """
        UPDATE shop_owner
        SET name = $2, owner_name = $3, gst_no = $4, address = $5, bank_details = $6
        WHERE id = $1 AND is_deleted = FALSE
        RETURNING id, name, owner_name, gst_no, address, bank_details, created_at
        """
        try:
            row = await self.connection.fetchrow(
                query,
                id,
                shop_owner.name,
                shop_owner.owner_name,
                shop_owner.gst_no,
                shop_owner.address.model_dump_json(),
                shop_owner.bank_details.model_dump_json(),
            )
            if row:
                return ShopOwner(
                    id=row["id"],
                    name=row["name"],
                    owner_name=row["owner_name"],
                    gst_no=row["gst_no"],
                    address=Address.model_validate_json(row["address"]),
                    bank_details=BankDetails.model_validate_json(row["bank_details"]),
                    created_at=row["created_at"],
                )
            raise ShopOwnerNotFound(context={"shop_owner_id": str(id)})
        except asyncpg.UniqueViolationError:
            raise ShopOwnerGSTAlreadyExists(context={"gst_no": shop_owner.gst_no})

    async def delete(self, shop_owner_id: UUID) -> None:
        query = """
        UPDATE users
        SET is_deleted = TRUE
        WHERE id = $1
        """
        result = await self.connection.execute(query, shop_owner_id)
        if result == "UPDATE 0":
            raise ShopOwnerNotFound(context={"shop_owner_id": str(shop_owner_id)})
