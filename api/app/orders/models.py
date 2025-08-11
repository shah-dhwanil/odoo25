from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.base.schemas import Address
from app.products.models import RentalUnit


class OrderStatus(str, Enum):
    DRAFT = "DRAFT"
    CONFIRMED = "CONFIRMED"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    PICKED = "PICKED"
    CANCELLED = "CANCELLED"


class PaymentStatus(str, Enum):
    NOT_APPLICABLE = "NOT APPLICABLE"
    PARTIAL = "PARTIAL"
    FULL = "FULL"
    REFUNDED = "REFUNDED"


class Amount(BaseModel):
    item_total: float = Field(..., description="Total amount for the items")
    platform_charge: float = Field(..., description="Platform charge for the order")
    subtotal: float = Field(..., description="Subtotal amount")
    tax: float = Field(..., description="Tax amount")
    total: float = Field(..., description="Total amount")


class Order(BaseModel):
    id: UUID = Field(..., description="The unique identifier of the order")
    user_id: UUID = Field(..., description="User who placed the order")
    product_id: UUID = Field(..., description="Product being ordered")
    quantity: int = Field(..., description="Quantity of the product", gt=0)
    rent_start_date: datetime = Field(..., description="Rental start date")
    rent_end_date: datetime = Field(..., description="Rental end date")
    delivery_location: Address = Field(..., description="Delivery location details")
    pickup_location: Address = Field(..., description="Pickup location details")
    delivery_date: datetime = Field(..., description="Scheduled delivery date")
    pickup_date: datetime = Field(..., description="Scheduled pickup date")
    amount: Amount = Field(..., description="Amount breakdown")
    amount_paid: float = Field(..., description="Amount already paid")
    amount_due: float = Field(..., description="Amount due")
    order_status: OrderStatus = Field(..., description="Current order status")
    payment_status: PaymentStatus = Field(..., description="Current payment status")
    delivery_photo_id: list[UUID] = Field(default=[], description="Delivery photo IDs")
    pickup_photo_id: list[UUID] = Field(default=[], description="Pickup photo IDs")
    ratings: Optional[int] = Field(None, description="Order rating (1-5)", ge=1, le=5)
    created_at: datetime = Field(..., description="Order creation timestamp")
    updated_at: datetime = Field(..., description="Order last update timestamp")


class CreateOrder(BaseModel):
    user_id: UUID = Field(..., description="User who placed the order")
    product_id: UUID = Field(..., description="Product being ordered")
    quantity: int = Field(..., description="Quantity of the product", gt=0)
    rate: RentalUnit = Field(..., description="Rental rate details")
    rent_start_date: datetime = Field(..., description="Rental start date")
    rent_end_date: datetime = Field(..., description="Rental end date")
    delivery_location: Address = Field(..., description="Delivery location details")
    pickup_location: Address = Field(..., description="Pickup location details")
    delivery_date: datetime = Field(..., description="Scheduled delivery date")
    pickup_date: datetime = Field(..., description="Scheduled pickup date")
    order_status: OrderStatus = Field(
        default=OrderStatus.DRAFT, description="Initial order status"
    )
    payment_status: PaymentStatus = Field(
        default=PaymentStatus.NOT_APPLICABLE, description="Initial payment status"
    )


class UpdateAmountPaid(BaseModel):
    amount_paid: float = Field(..., description="Amount already paid")


class UpdateOrderStatus(BaseModel):
    order_status: OrderStatus = Field(..., description="New order status")


class UpdatePaymentStatus(BaseModel):
    payment_status: PaymentStatus = Field(..., description="New payment status")


class UpdateDeliveryPhotoId(BaseModel):
    delivery_photo_id: list[UUID] = Field(..., description="New delivery photo IDs")


class UpdatePickupPhotoId(BaseModel):
    pickup_photo_id: list[UUID] = Field(..., description="New pickup photo IDs")


class UpdateRatings(BaseModel):
    ratings: int = Field(..., description="New order rating (1-5)", ge=1, le=5)


class ListOrder(BaseModel):
    orders: list[Order]
