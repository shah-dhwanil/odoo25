from typing import List, Optional
from uuid import UUID

import asyncpg
from fastapi import APIRouter, Depends, Query, status
from structlog import get_logger

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.database import PgPool

from .exceptions import (
    EmailAlreadyExistsException,
    MobileNumberAlreadyExistsException,
    UserNotFoundException,
)
from .models import (
    UserAuthResponse,
    UserCreate,
    UserListResponse,
    UserLogin,
    UserPasswordUpdate,
    UserResponse,
    UserType,
)
from .service import UserService

logger = get_logger(__name__)

router = APIRouter(prefix="/users", tags=["Users"])


async def get_user_service(
    connection: asyncpg.Connection = Depends(PgPool.get_connection),
) -> UserService:
    """Dependency to get UserService with database connection"""
    yield UserService(connection)
    await connection.close()


@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
    description="Create a new user with email, mobile number, password, and user type",
)
async def create_user(
    user_data: UserCreate,
    user_service: UserService = Depends(get_user_service),
) -> UserResponse:
    """Create a new user"""
    try:
        return await user_service.create_user(user_data)
    except EmailAlreadyExistsException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )
    except MobileNumberAlreadyExistsException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )


@router.post(
    "/login",
    response_model=UserAuthResponse,
    summary="Authenticate user",
    description="Authenticate user with email and password",
)
async def login_user(
    login_data: UserLogin,
    user_service: UserService = Depends(get_user_service),
) -> UserAuthResponse:
    """Authenticate user with email and password"""
    try:
        return await user_service.authenticate_user(login_data)
    except UserNotFoundException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                error=e,
            )
        )


@router.get(
    "/",
    response_model=UserListResponse,
    summary="List users",
    description="Get a paginated list of users with optional filtering",
)
async def list_users(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Number of users per page"),
    user_type: Optional[UserType] = Query(None, description="Filter by user type"),
    include_deleted: bool = Query(False, description="Include soft-deleted users"),
    search: Optional[str] = Query(None, description="Search in email or mobile number"),
    user_service: UserService = Depends(get_user_service),
) -> UserListResponse:
    """List users with pagination and filtering"""
    return await user_service.list_users(
        page=page,
        page_size=page_size,
        user_type=user_type,
        include_deleted=include_deleted,
        search=search,
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user by ID",
    description="Get a specific user by their ID",
)
async def get_user(
    user_id: UUID,
    include_deleted: bool = Query(False, description="Include soft-deleted users"),
    user_service: UserService = Depends(get_user_service),
) -> UserResponse:
    """Get a user by ID"""
    try:
        return await user_service.get_user_by_id(user_id, include_deleted)
    except UserNotFoundException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.get(
    "/email/{email}",
    response_model=UserResponse,
    summary="Get user by email",
    description="Get a specific user by their email address",
)
async def get_user_by_email(
    email: str,
    include_deleted: bool = Query(False, description="Include soft-deleted users"),
    user_service: UserService = Depends(get_user_service),
) -> UserResponse:
    """Get a user by email"""
    try:
        return await user_service.get_user_by_email(email, include_deleted)
    except UserNotFoundException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.get(
    "/mobile/{mobile_no}",
    response_model=UserResponse,
    summary="Get user by mobile number",
    description="Get a specific user by their mobile number",
)
async def get_user_by_mobile(
    mobile_no: str,
    include_deleted: bool = Query(False, description="Include soft-deleted users"),
    user_service: UserService = Depends(get_user_service),
) -> UserResponse:
    """Get a user by mobile number"""
    try:
        return await user_service.get_user_by_mobile(mobile_no, include_deleted)
    except UserNotFoundException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.get(
    "/type/{user_type}",
    response_model=List[UserResponse],
    summary="Get users by type",
    description="Get all users of a specific type",
)
async def get_users_by_type(
    user_type: UserType,
    include_deleted: bool = Query(False, description="Include soft-deleted users"),
    user_service: UserService = Depends(get_user_service),
) -> List[UserResponse]:
    """Get all users of a specific type"""
    return await user_service.get_users_by_type(user_type, include_deleted)


@router.patch(
    "/{user_id}/password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Update user password",
    description="Update a user's password with current password verification",
)
async def update_password(
    user_id: UUID,
    password_data: UserPasswordUpdate,
    user_service: UserService = Depends(get_user_service),
):
    """Update user password with current password verification"""
    try:
        await user_service.update_password(user_id, password_data)
    except UserNotFoundException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
    description="Soft delete a user (sets is_deleted = TRUE)",
)
async def delete_user(
    user_id: UUID,
    user_service: UserService = Depends(get_user_service),
):
    """Soft delete a user"""
    try:
        await user_service.delete_user(user_id)
    except UserNotFoundException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.post(
    "/admin",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create admin user",
    description="Create a new admin user (forces user_type to ADMIN)",
)
async def create_admin_user(
    user_data: UserCreate,
    user_service: UserService = Depends(get_user_service),
) -> UserResponse:
    """Create an admin user"""
    try:
        return await user_service.create_admin_user(user_data)
    except EmailAlreadyExistsException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )
    except MobileNumberAlreadyExistsException as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )
