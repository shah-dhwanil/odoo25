from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.base.schemas import Address


class DeliveryPartner(BaseModel):
    id: UUID = Field(..., description="The unique identifier of the delivery partner")
    name: str = Field(..., description="The name of the delivery partner")
    address: Address = Field(..., description="Delivery partner address details")
    is_deleted: bool = Field(default=False, description="Soft delete flag")
    created_at: datetime


class CreateDeliveryPartner(BaseModel):
    id: UUID
    name: str = Field(
        ..., description="The name of the delivery partner", max_length=128
    )
    address: Address = Field(..., description="Delivery partner address details")


class ListDeliveryPartner(BaseModel):
    delivery_partners: list[DeliveryPartner]


class UpdateDeliveryPartner(BaseModel):
    name: str = Field(
        ..., description="The name of the delivery partner", max_length=128
    )
    address: Address = Field(..., description="Delivery partner address details")
