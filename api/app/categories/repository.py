from uuid import UUID

import asyncpg
from uuid_utils.compat import uuid7

from app.categories.exceptions import CategoryNotFound
from app.categories.models import Category, CreateCategory, UpdateCategory


class CategoryRepository:
    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def create(self, category: CreateCategory) -> Category:
        query = """
        INSERT INTO categories (id,name, description)
        VALUES ($1, $2,$3)
        RETURNING id, name, description, created_at
        """
        row = await self.connection.fetchrow(
            query, uuid7(), category.name, category.description
        )
        return Category(**row)

    async def list(self) -> list[Category]:
        query = """
        SELECT id, name, description, created_at
        FROM categories
        WHERE is_deleted=FALSE;
        """
        rows = await self.connection.fetch(query)
        return [Category(**row) for row in rows]

    async def get_by_id(self, category_id: UUID) -> Category:
        query = """
        SELECT id, name, description, created_at
        FROM categories
        WHERE id = $1 AND is_deleted = FALSE;
        """
        row = await self.connection.fetchrow(query, category_id)
        if row:
            return Category(**row)
        raise CategoryNotFound(context={"category_id": str(category_id)})

    async def update(self, id: UUID, category: UpdateCategory) -> Category:
        query = """
        UPDATE categories
        SET name = $2, description = $3
        WHERE id = $1
        RETURNING id, name, description, created_at
        """
        row = await self.connection.fetchrow(
            query, id, category.name, category.description
        )
        if row:
            return Category(**row)
        raise CategoryNotFound(context={"category_id": id})

    async def delete(self, category_id: UUID) -> None:
        query = """
        UPDATE categories
        SET is_deleted = TRUE
        WHERE id = $1
        """
        result = await self.connection.execute(query, category_id)
        if result == "UPDATE 0":
            raise CategoryNotFound(context={"category_id": category_id})
