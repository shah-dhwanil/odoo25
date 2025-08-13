from uuid import UUID

import asyncpg
from fastapi import APIRouter, Depends, status

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.categories.exceptions import CategoryAlreadyExists, CategoryNotFound
from app.categories.models import Category, CreateCategory, ListCategory, UpdateCategory
from app.categories.repository import CategoryRepository
from app.categories.service import CategoryService
from app.database import PgPool
from app.users.dependency import RequiresRole
from app.users.models import UserType

router = APIRouter(prefix="/categories", tags=["categories"])


async def get_category_service(
    connection: asyncpg.Connection = Depends(PgPool.get_connection),
) -> CategoryService:
    """Dependency to get CategoryService with database connection"""
    try:
        repository = CategoryRepository(connection)
        yield CategoryService(repository)
    finally:
        await connection.close()


@router.post(
    "/",
    response_model=Category,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(RequiresRole(UserType.ADMIN))],
)
async def create_category(
    category_data: CreateCategory,
    service: CategoryService = Depends(get_category_service),
) -> Category:
    """Create a new category."""
    try:
        return await service.create_category(category_data)
    except CategoryAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )


@router.get("/", response_model=ListCategory)
async def get_categories(
    service: CategoryService = Depends(get_category_service),
) -> ListCategory:
    """Get all categories."""
    categories = await service.get_categories()
    return ListCategory(categories=categories)


@router.get("/{category_id}", response_model=Category)
async def get_category(
    category_id: UUID, service: CategoryService = Depends(get_category_service)
) -> Category:
    """Get a category by ID."""
    try:
        return await service.get_category(category_id)
    except CategoryNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.put(
    "/{category_id}",
    response_model=Category,
    dependencies=[Depends(RequiresRole(UserType.ADMIN))],
)
async def update_category(
    category_id: UUID,
    category_data: UpdateCategory,
    service: CategoryService = Depends(get_category_service),
) -> Category:
    """Update an existing category."""
    try:
        return await service.update_category(category_id, category_data)
    except CategoryNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except CategoryAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(RequiresRole(UserType.ADMIN))],
)
async def delete_category(
    category_id: UUID, service: CategoryService = Depends(get_category_service)
) -> None:
    """Delete a category (soft delete)."""
    try:
        await service.delete_category(category_id)
    except CategoryNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
