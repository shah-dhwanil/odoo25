from uuid import UUID

from app.categories.models import Category, CreateCategory, UpdateCategory
from app.categories.repository import CategoryRepository


class CategoryService:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def create_category(self, category_data: CreateCategory) -> Category:
        """Create a new category."""
        # TODO: Add validation for duplicate names if needed
        return await self.repository.create(category_data)

    async def get_categories(self) -> list[Category]:
        """Get all categories."""
        return await self.repository.list()

    async def get_category(self, category_id: UUID) -> Category:
        """Get a category by ID."""
        return await self.repository.get_by_id(category_id)

    async def update_category(
        self, category_id: UUID, category_data: UpdateCategory
    ) -> Category:
        """Update an existing category."""
        return await self.repository.update(category_id, category_data)

    async def delete_category(self, category_id: UUID) -> None:
        """Soft delete a category."""
        await self.repository.delete(category_id)
