from typing import List, Optional
from uuid import UUID

import asyncpg

from app.products.exceptions import (
    InsufficientQuantity,
    InvalidPriceConfiguration,
    InvalidRentalUnit,
    ProductDeleted,
)
from app.products.models import CreateProduct, Product, RentalUnit, UpdateProduct
from app.products.repository import ProductRepository


class ProductService:
    def __init__(self, connection: asyncpg.Connection):
        self.repository = ProductRepository(connection)

    async def create_product(self, product: CreateProduct) -> Product:
        """Create a new product with validation"""
        # Validate price configuration matches rental units
        self._validate_price_configuration(product.rental_units, product.price)

        # Validate quantities
        if product.total_quantity < 1:
            raise InsufficientQuantity(
                detail="Total quantity must be at least 1",
                context={"total_quantity": product.total_quantity},
            )

        return await self.repository.create(product)

    async def get_product(self, product_id: UUID) -> Product:
        """Get a product by ID"""
        product = await self.repository.get_by_id(product_id)
        if product.is_deleted:
            raise ProductDeleted(context={"product_id": str(product_id)})
        return product

    async def list_products(
        self, owner_id: Optional[UUID] = None, category_id: Optional[UUID] = None
    ) -> List[Product]:
        """List products with optional filtering"""
        return await self.repository.list(owner_id=owner_id, category_id=category_id)

    async def update_product(
        self, product_id: UUID, update_data: UpdateProduct, requester_owner_id: UUID
    ) -> Product:
        """Update a product with ownership validation"""
        return await self.repository.update(product_id, update_data, requester_owner_id)

    async def delete_product(self, product_id: UUID) -> None:
        """Soft delete a product with ownership validation"""
        # Get current product to check ownership
        current_product = await self.get_product(product_id)
        # Check if product can be deleted (no active rentals)
        if current_product.rented_quantity > 0:
            raise InsufficientQuantity(
                detail="Cannot delete product with active rentals",
                context={
                    "product_id": str(product_id),
                    "rented_quantity": current_product.rented_quantity,
                },
            )

        await self.repository.delete(product_id)

    async def search_products(self, search_term: str, limit: int) -> List[Product]:
        """Search products by name using full-text search"""
        return await self.repository.search_by_name(search_term, limit=50)

    async def confirm_rental(self, product_id: UUID, quantity: int) -> Product:
        """Move quantity from reserved to rented"""
        product = await self.get_product(product_id)

        if product.available_quantity < quantity:
            raise InsufficientQuantity(
                detail=f"Not enough available quantity. Available: {product.available_quantity}, Requested: {quantity}",
                context={
                    "product_id": str(product_id),
                    "available": product.available_quantity,
                    "requested": quantity,
                },
            )

        # return await self.repository.update_quantities(
        #    product_id, product.available_quantity, new_reserved, new_rented
        # )
        return await self.repository.confirm_rental(product_id, quantity)

    async def return_rental(self, product_id: UUID, quantity: int) -> Product:
        """Return rented quantity back to available"""
        product = await self.get_product(product_id)

        if product.rented_quantity < quantity:
            raise InsufficientQuantity(
                detail=f"Cannot return more than rented quantity. Rented: {product.rented_quantity}, Requested: {quantity}",
                context={
                    "product_id": str(product_id),
                    "rented": product.rented_quantity,
                    "requested": quantity,
                },
            )

        # return await self.repository.update_quantities(
        #     product_id, new_available, product.reserved_quantity, new_rented
        # )
        return await self.repository.return_rental(product_id, quantity)

    async def get_price_for_rental_unit(
        self, product_id: UUID, rental_unit: RentalUnit
    ) -> float:
        """Get price for a specific rental unit"""
        product = await self.get_product(product_id)

        if rental_unit not in product.rental_units:
            raise InvalidRentalUnit(
                detail=f"Rental unit {rental_unit.value} is not available for this product",
                context={
                    "product_id": str(product_id),
                    "requested_unit": rental_unit.value,
                    "available_units": [unit.value for unit in product.rental_units],
                },
            )

        return product.price.get(rental_unit, 0.0)

    def _validate_price_configuration(
        self, rental_units: List[RentalUnit], price: dict[RentalUnit, float]
    ) -> None:
        """Validate that price configuration matches rental units"""
        rental_unit_set = set(rental_units)
        price_unit_set = set(price.keys())

        if rental_unit_set != price_unit_set:
            raise InvalidPriceConfiguration(
                detail="Price configuration must include all rental units and no extras",
                context={
                    "rental_units": [unit.value for unit in rental_units],
                    "price_units": [unit.value for unit in price.keys()],
                },
            )

        # Validate all prices are positive
        for unit, unit_price in price.items():
            if unit_price < 0:
                raise InvalidPriceConfiguration(
                    detail=f"Price for {unit.value} must be non-negative",
                    context={"unit": unit.value, "price": unit_price},
                )
