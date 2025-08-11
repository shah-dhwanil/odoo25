from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.base.schemas import Address


class Addresses(BaseModel):
    address: dict[str, Address] = Field(..., description="Customer address details")


class Customer(BaseModel):
    id: UUID = Field(..., description="The unique identifier of the customer")
    name: str = Field(..., description="The name of the customer")
    address: Addresses = Field(..., description="Customer address details")
    loyalty_points: int = Field(default=10, description="Customer loyalty points")
    is_deleted: bool = Field(default=False, description="Soft delete flag")
    created_at: datetime


class CreateCustomer(BaseModel):
    id: UUID
    name: str = Field(..., description="The name of the customer", max_length=128)
    address: Addresses = Field(..., description="Customer address details")
    loyalty_points: Optional[int] = Field(
        default=10, description="Customer loyalty points"
    )


class ListCustomer(BaseModel):
    customers: list[Customer]


class UpdateCustomer(BaseModel):
    name: str = Field(..., description="The name of the customer", max_length=128)
    address: Addresses = Field(..., description="Customer address details")
    loyalty_points: int = Field(..., description="Customer loyalty points")
