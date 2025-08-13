from uuid import UUID

import asyncpg
from fastapi import APIRouter, Depends, status

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.customers.exceptions import CustomerAlreadyExists, CustomerNotFound
from app.customers.models import CreateCustomer, Customer, ListCustomer, UpdateCustomer
from app.customers.service import CustomerService
from app.database import PgPool
from app.users.dependency import RequiresRole
from app.users.models import UserType

router = APIRouter(prefix="/customers", tags=["customers"])


async def get_customer_service(
    connection: asyncpg.Connection = Depends(PgPool.get_connection),
) -> CustomerService:
    """Dependency to get CustomerService with database connection"""
    try:
        yield CustomerService(connection)
    finally:
        await connection.close()


@router.post("/", response_model=Customer, status_code=status.HTTP_201_CREATED)
async def create_customer(
    customer_data: CreateCustomer,
    service: CustomerService = Depends(get_customer_service),
) -> Customer:
    """Create a new customer."""
    try:
        return await service.create_customer(customer_data)
    except CustomerAlreadyExists as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                error=e,
            )
        )


@router.get(
    "/",
    response_model=ListCustomer,
    dependencies=[Depends(RequiresRole(UserType.ADMIN))],
)
async def get_customers(
    service: CustomerService = Depends(get_customer_service),
) -> ListCustomer:
    """Get all customers."""
    customers = await service.list_customers()
    return ListCustomer(customers=customers)


@router.get(
    "/{customer_id}",
    response_model=Customer,
    dependencies=[Depends(RequiresRole(UserType.ADMIN, UserType.CUSTOMER))],
)
async def get_customer(
    customer_id: UUID, service: CustomerService = Depends(get_customer_service)
) -> Customer:
    """Get a customer by ID."""
    try:
        return await service.get_customer_by_id(customer_id)
    except CustomerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.put(
    "/{customer_id}",
    response_model=Customer,
    dependencies=[Depends(RequiresRole(UserType.ADMIN, UserType.CUSTOMER))],
)
async def update_customer(
    customer_id: UUID,
    customer_data: UpdateCustomer,
    service: CustomerService = Depends(get_customer_service),
) -> Customer:
    """Update an existing customer."""
    try:
        return await service.update_customer(customer_id, customer_data)
    except CustomerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(RequiresRole(UserType.ADMIN, UserType.CUSTOMER))],
)
async def delete_customer(
    customer_id: UUID, service: CustomerService = Depends(get_customer_service)
) -> None:
    """Delete a customer (soft delete)."""
    try:
        await service.delete_customer(customer_id)
    except CustomerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )


@router.post(
    "/{customer_id}/loyalty-points/add",
    response_model=Customer,
    dependencies=[Depends(RequiresRole(UserType.ADMIN, UserType.CUSTOMER))],
)
async def add_loyalty_points(
    customer_id: UUID,
    points: int,
    service: CustomerService = Depends(get_customer_service),
) -> Customer:
    """Add loyalty points to a customer."""
    try:
        return await service.add_loyalty_points(customer_id, points)
    except CustomerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except ValueError as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=str(e),
            )
        )


@router.post(
    "/{customer_id}/loyalty-points/redeem",
    response_model=Customer,
    dependencies=[Depends(RequiresRole(UserType.ADMIN, UserType.CUSTOMER))],
)
async def redeem_loyalty_points(
    customer_id: UUID,
    points: int,
    service: CustomerService = Depends(get_customer_service),
) -> Customer:
    """Redeem loyalty points from a customer."""
    try:
        return await service.redeem_loyalty_points(customer_id, points)
    except CustomerNotFound as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                error=e,
            )
        )
    except ValueError as e:
        return http_exception_handler(
            HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                error=str(e),
            )
        )
