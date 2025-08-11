import json
from typing import List, Optional
from uuid import UUID

import asyncpg
from uuid_utils.compat import uuid7

from app.products.exceptions import (
    InsufficientQuantity,
    InvalidPriceConfiguration,
    ProductDeleted,
    ProductNotFound,
)
from app.products.models import CreateProduct, Product, RentalUnit, UpdateProduct


class ProductRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create(self, product: CreateProduct) -> Product:
        # Validate price configuration matches rental units
        if set(product.price.keys()) != set(product.rental_units):
            raise InvalidPriceConfiguration(
                detail="Price configuration must include all rental units and no extras"
            )
        query = """
        INSERT INTO products (
            id, name, description, category_id, owner_id, rental_units, price,
            security_deposit, defect_charges, care_instruction, total_quantity,
            available_quantity, reserved_quantity, rented_quantity, images_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id, name, description, category_id, owner_id, rental_units, price,
                 security_deposit, defect_charges, care_instruction, total_quantity,
                 available_quantity, reserved_quantity, rented_quantity, images_id,
                 is_deleted, created_at
        """
        # Convert rental units to PostgreSQL array format
        rental_units_array = [unit.value for unit in product.rental_units]
        price_json = json.dumps({k.value: v for k, v in product.price.items()})

        row = await self.connection.fetchrow(
            query,
            uuid7(),
            product.name,
            product.description,
            product.category_id,
            product.owner_id,
            rental_units_array,
            price_json,
            product.security_deposit,
            product.defect_charges,
            product.care_instruction,
            product.total_quantity,
            product.total_quantity,  # available_quantity initially equals total_quantity
            0,  # reserved_quantity
            0,  # rented_quantity
            product.images_id,
        )
        return self._row_to_product(row)

    async def list(
        self, owner_id: Optional[UUID] = None, category_id: Optional[UUID] = None
    ) -> List[Product]:
        if owner_id:
            query = """
            SELECT id, name, description, category_id, owner_id, rental_units, price,
                   security_deposit, defect_charges, care_instruction, total_quantity,
                   available_quantity, reserved_quantity, rented_quantity, images_id,
                   is_deleted, created_at
            FROM products
            WHERE owner_id = $1 AND is_deleted = FALSE
            ORDER BY created_at DESC
            """
            rows = await self.connection.fetch(query, owner_id)
        elif category_id:
            query = """
            SELECT id, name, description, category_id, owner_id, rental_units, price,
                   security_deposit, defect_charges, care_instruction, total_quantity,
                   available_quantity, reserved_quantity, rented_quantity, images_id,
                   is_deleted, created_at
            FROM products
            WHERE category_id = $1 AND is_deleted = FALSE
            ORDER BY created_at DESC
            """
            rows = await self.connection.fetch(query, category_id)
        else:
            query = """
            SELECT id, name, description, category_id, owner_id, rental_units, price,
                   security_deposit, defect_charges, care_instruction, total_quantity,
                   available_quantity, reserved_quantity, rented_quantity, images_id,
                   is_deleted, created_at
            FROM products
            WHERE is_deleted = FALSE
            ORDER BY created_at DESC
            """
            rows = await self.connection.fetch(query)

        return [self._row_to_product(row) for row in rows]

    async def get_by_id(self, product_id: UUID) -> Product:
        query = """
        SELECT id, name, description, category_id, owner_id, rental_units, price,
               security_deposit, defect_charges, care_instruction, total_quantity,
               available_quantity, reserved_quantity, rented_quantity, images_id,
               is_deleted, created_at
        FROM products
        WHERE id = $1
        """
        row = await self.connection.fetchrow(query, product_id)
        if not row:
            raise ProductNotFound(context={"product_id": str(product_id)})

        if row["is_deleted"]:
            raise ProductDeleted(context={"product_id": str(product_id)})

        return self._row_to_product(row)

    async def update(
        self, product_id: UUID, product: UpdateProduct, owner_id: UUID
    ) -> Product:
        query = """
            UPDATE products 
            SET 
                name = $2,
                description = $3,
                category_id = $4,
                rental_units = $5,
                price = $6,
                security_deposit = $7,
                defect_charges = $8,
                care_instruction = $9,
                total_quantity = $10,
                images_id = $11
            WHERE id = $1
            RETURNING id, name, description, category_id, owner_id, rental_units, price,
                 security_deposit, defect_charges, care_instruction, total_quantity,
                 available_quantity, reserved_quantity, rented_quantity, images_id,
                 is_deleted, created_at;
        """
        # Convert rental units to PostgreSQL array format
        rental_units = [unit.value for unit in product.rental_units]
        price_json = json.dumps({k.value: v for k, v in product.price.items()})
        row = await self.connection.fetchrow(
            query,
            product_id,
            product.name,
            product.description,
            product.category_id,
            rental_units,
            price_json,
            product.security_deposit,
            product.defect_charges,
            product.care_instruction,
            product.total_quantity,
            product.images_id,
        )
        if row is not None:
            return self._row_to_product(row)
        else:
            raise ProductNotFound(context={"product_id": str(product_id)})

    async def delete(self, product_id: UUID) -> None:
        query = """
        UPDATE products
        SET is_deleted = TRUE
        WHERE id = $1 AND is_deleted = FALSE
        """
        result = await self.connection.execute(query, product_id)
        if result == "UPDATE 0":
            raise ProductNotFound(context={"product_id": str(product_id)})

    async def confirm_rental(self, product_id: UUID, quantity: int) -> Product:
        query = """
        UPDATE products
        SET available_quantity = available_quantity - $2,
            rented_quantity = rented_quantity + $2
        WHERE id = $1 AND available_quantity >= $2 AND is_deleted = FALSE
        RETURNING id, name, description, category_id, owner_id, rental_units, price,
                 security_deposit, defect_charges, care_instruction, total_quantity,
                 available_quantity, reserved_quantity, rented_quantity, images_id,
                 is_deleted, created_at
        """
        row = await self.connection.fetchrow(query, product_id, quantity)
        if not row:
            await self.get_by_id(product_id)
            raise InsufficientQuantity(
                context={"product_id": str(product_id), "requested_quantity": quantity}
            )

        return self._row_to_product(row)

    async def return_rental(self, product_id: UUID, quantity: int) -> Product:
        query = """
        UPDATE products
        SET rented_quantity = rented_quantity - $2,
            available_quantity = available_quantity + $2
        WHERE id = $1 AND rented_quantity >= $2 AND is_deleted = FALSE
        RETURNING id, name, description, category_id, owner_id, rental_units, price,
                 security_deposit, defect_charges, care_instruction, total_quantity,
                 available_quantity, reserved_quantity, rented_quantity, images_id,
                 is_deleted, created_at
        """
        row = await self.connection.fetchrow(query, product_id, quantity)
        if not row:
            await self.get_by_id(product_id)
            raise InsufficientQuantity(
                context={"product_id": str(product_id), "return_quantity": quantity}
            )

        return self._row_to_product(row)

    async def search_by_name(self, search_term: str, limit: int = 50) -> List[Product]:
        query = """
        SELECT id, name, description, category_id, owner_id, rental_units, price,
               security_deposit, defect_charges, care_instruction, total_quantity,
               available_quantity, reserved_quantity, rented_quantity, images_id,
               is_deleted, created_at
        FROM products
        WHERE to_tsvector('english', name) @@ plainto_tsquery('english', $1)
          AND is_deleted = FALSE
        ORDER BY ts_rank(to_tsvector('english', name), plainto_tsquery('english', $1)) DESC
        LIMIT $2
        """
        rows = await self.connection.fetch(query, search_term, limit)
        return [self._row_to_product(row) for row in rows]

    def _row_to_product(self, row) -> Product:
        # Convert rental_units array back to enum list
        rental_units = [RentalUnit(unit) for unit in row["rental_units"]]

        # Parse price JSON and convert keys back to RentalUnit enums
        price_dict = json.loads(row["price"])
        # price = {RentalUnit(k): v for k, v in price_dict.items()}

        # Convert image IDs back to UUIDs
        # images_id = [UUID(img_id) for img_id in row["images_id"]]

        return Product(
            id=row["id"],
            name=row["name"],
            description=row["description"],
            category_id=row["category_id"],
            owner_id=row["owner_id"],
            rental_units=rental_units,
            price=price_dict,
            security_deposit=row["security_deposit"],
            defect_charges=row["defect_charges"],
            care_instruction=row["care_instruction"],
            total_quantity=row["total_quantity"],
            available_quantity=row["available_quantity"],
            reserved_quantity=row["reserved_quantity"],
            rented_quantity=row["rented_quantity"],
            images_id=row["images_id"],
            is_deleted=row["is_deleted"],
            created_at=row["created_at"],
        )
