from uuid import UUID

import asyncpg

from app.customers.exceptions import CustomerAlreadyExists, CustomerNotFound
from app.customers.models import Addresses, CreateCustomer, Customer, UpdateCustomer


class CustomerRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create(self, customer: CreateCustomer) -> Customer:
        query = """
        INSERT INTO customers (id, name, address, loyalty_points)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, address, loyalty_points, is_deleted, created_at
        """
        try:
            row = await self.connection.fetchrow(
                query,
                customer.id,
                customer.name,
                customer.address.model_dump_json(),
                customer.loyalty_points,
            )
            return Customer(
                id=row["id"],
                name=row["name"],
                address=Addresses.model_validate_json(row["address"]),
                loyalty_points=row["loyalty_points"],
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        except asyncpg.UniqueViolationError:
            raise CustomerAlreadyExists(context={"customer_id": str(customer.id)})
        except asyncpg.ForeignKeyViolationError:
            raise CustomerNotFound(
                context={
                    "id": str(customer.id),
                    "msg": "User not found with given id",
                }
            )

    async def list(self) -> list[Customer]:
        query = """
        SELECT id, name, address, loyalty_points, is_deleted, created_at
        FROM customers
        WHERE is_deleted = FALSE
        """
        rows = await self.connection.fetch(query)
        return [
            Customer(
                id=row["id"],
                name=row["name"],
                address=Addresses.model_validate_json(row["address"]),
                loyalty_points=row["loyalty_points"],
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
            for row in rows
        ]

    async def get_by_id(self, customer_id: UUID) -> Customer:
        query = """
        SELECT id, name, address, loyalty_points, is_deleted, created_at
        FROM customers
        WHERE id = $1 AND is_deleted = FALSE
        """
        row = await self.connection.fetchrow(query, customer_id)
        if row:
            return Customer(
                id=row["id"],
                name=row["name"],
                address=Addresses.model_validate_json(row["address"]),
                loyalty_points=row["loyalty_points"],
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        raise CustomerNotFound(context={"customer_id": str(customer_id)})

    async def update(self, id: UUID, customer: UpdateCustomer) -> Customer:
        query = """
        UPDATE customers
        SET name = $2, address = $3, loyalty_points = $4
        WHERE id = $1 AND is_deleted = FALSE
        RETURNING id, name, address, loyalty_points, is_deleted, created_at
        """
        row = await self.connection.fetchrow(
            query,
            id,
            customer.name,
            customer.address.model_dump_json(),
            customer.loyalty_points,
        )
        if row:
            return Customer(
                id=row["id"],
                name=row["name"],
                address=Addresses.model_validate_json(row["address"]),
                loyalty_points=row["loyalty_points"],
                is_deleted=row["is_deleted"],
                created_at=row["created_at"],
            )
        raise CustomerNotFound(context={"customer_id": str(id)})

    async def delete(self, customer_id: UUID) -> None:
        query = """
        UPDATE users
        SET is_deleted = TRUE
        WHERE id = $1
        """
        result = await self.connection.execute(query, customer_id)
        if result == "UPDATE 0":
            raise CustomerNotFound(context={"customer_id": str(customer_id)})
