from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class DeliveryType(str, Enum):
    PICKUP = "PICKUP"
    DROP = "DROP"


class Delivery(BaseModel):
    id: UUID = Field(..., description="The unique identifier of the delivery")
    order_id: UUID = Field(..., description="The ID of the associated order")
    delivery_type: DeliveryType = Field(
        ..., description="The type of delivery (PICKUP or DROP)"
    )
    delivery_partner_id: UUID = Field(..., description="The ID of the delivery partner")
    ratings: Optional[int] = Field(
        None, description="The rating given to the delivery (1-5)"
    )


class CreateDelivery(BaseModel):
    order_id: UUID = Field(..., description="The ID of the associated order")
    delivery_partner_id: UUID = Field(..., description="The ID of the delivery partner")
    delivery_type: DeliveryType = Field(
        ..., description="The type of delivery (PICKUP or DROP)"
    )
    ratings: Optional[int] = Field(
        None, description="The rating given to the delivery (1-5)"
    )


class ListDelivery(BaseModel):
    deliveries: list[Delivery]


class UpdateDelivery(BaseModel):
    ratings: Optional[int] = Field(
        None, description="The rating given to the delivery (1-5)"
    )
