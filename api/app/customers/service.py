from uuid import UUID

import asyncpg

from app.customers.models import CreateCustomer, Customer, UpdateCustomer
from app.customers.repository import CustomerRepository


class CustomerService:
    def __init__(self, connection: asyncpg.Connection):
        self.repository = CustomerRepository(connection)

    async def create_customer(self, customer_data: CreateCustomer) -> Customer:
        """Create a new customer with business logic validation."""

        return await self.repository.create(customer_data)

    async def get_customer_by_id(self, customer_id: UUID) -> Customer:
        """Retrieve a customer by ID."""
        return await self.repository.get_by_id(customer_id)

    async def list_customers(self) -> list[Customer]:
        """Retrieve all active customers."""
        return await self.repository.list()

    async def update_customer(
        self, customer_id: UUID, update_data: UpdateCustomer
    ) -> Customer:
        """Update an existing customer with business logic validation."""
        # Add any business logic validation here

        return await self.repository.update(customer_id, update_data)

    async def delete_customer(self, customer_id: UUID) -> None:
        """Soft delete a customer."""
        await self.repository.delete(customer_id)

    async def add_loyalty_points(self, customer_id: UUID, points: int) -> Customer:
        """Add loyalty points to a customer."""
        if points <= 0:
            raise ValueError("Points to add must be positive")

        customer = await self.get_customer_by_id(customer_id)
        updated_customer = UpdateCustomer(
            name=customer.name,
            address=customer.address,
            loyalty_points=customer.loyalty_points + points,
        )
        return await self.update_customer(customer_id, updated_customer)

    async def redeem_loyalty_points(self, customer_id: UUID, points: int) -> Customer:
        """Redeem loyalty points from a customer."""
        if points <= 0:
            raise ValueError("Points to redeem must be positive")

        customer = await self.get_customer_by_id(customer_id)
        if customer.loyalty_points < points:
            raise ValueError("Insufficient loyalty points")

        updated_customer = UpdateCustomer(
            name=customer.name,
            address=customer.address,
            loyalty_points=customer.loyalty_points - points,
        )
        return await self.update_customer(customer_id, updated_customer)
