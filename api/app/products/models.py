from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class RentalUnit(str, Enum):
    PER_HOUR = "PER_HOUR"
    PER_DAY = "PER_DAY"
    PER_WEEK = "PER_WEEK"
    PER_MONTH = "PER_MONTH"
    PER_YEAR = "PER_YEAR"


class Product(BaseModel):
    id: UUID = Field(..., description="The unique identifier of the product")
    name: str = Field(..., description="The name of the product")
    description: Optional[str] = Field(
        None, description="The description of the product"
    )
    category_id: UUID = Field(..., description="The category identifier")
    owner_id: UUID = Field(..., description="The owner identifier")
    rental_units: List[RentalUnit] = Field(..., description="Available rental units")
    price: Dict[RentalUnit, float] = Field(
        ..., description="Price configuration as JSON"
    )
    security_deposit: Decimal = Field(..., description="Security deposit amount")
    defect_charges: Decimal = Field(..., description="Defect charges amount")
    care_instruction: Optional[str] = Field(None, description="Care instructions")
    total_quantity: int = Field(1, description="Total quantity available")
    available_quantity: int = Field(1, description="Available quantity for rent")
    reserved_quantity: int = Field(0, description="Reserved quantity")
    rented_quantity: int = Field(0, description="Currently rented quantity")
    images_id: List[UUID] = Field(..., description="List of image identifiers")
    is_deleted: bool = Field(False, description="Soft delete flag")
    created_at: datetime


class CreateProduct(BaseModel):
    name: str = Field(..., description="The name of the product")
    description: Optional[str] = Field(
        None, description="The description of the product"
    )
    category_id: UUID = Field(..., description="The category identifier")
    owner_id: UUID = Field(..., description="The owner identifier")
    rental_units: List[RentalUnit] = Field(..., description="Available rental units")
    price: Dict[RentalUnit, float] = Field(
        ..., description="Price configuration as JSON"
    )
    security_deposit: Decimal = Field(..., description="Security deposit amount")
    defect_charges: Decimal = Field(..., description="Defect charges amount")
    care_instruction: Optional[str] = Field(None, description="Care instructions")
    total_quantity: int = Field(1, description="Total quantity available")
    images_id: List[UUID] = Field(..., description="List of image identifiers")


class ListProduct(BaseModel):
    products: List[Product]


class UpdateProduct(BaseModel):
    name: Optional[str] = Field(None, description="The name of the product")
    description: Optional[str] = Field(
        None, description="The description of the product"
    )
    category_id: Optional[UUID] = Field(None, description="The category identifier")
    rental_units: Optional[List[RentalUnit]] = Field(
        None, description="Available rental units"
    )
    price: Optional[Dict[RentalUnit, float]] = Field(
        None, description="Price configuration as JSON"
    )
    security_deposit: Optional[Decimal] = Field(
        None, description="Security deposit amount"
    )
    defect_charges: Optional[Decimal] = Field(None, description="Defect charges amount")
    care_instruction: Optional[str] = Field(None, description="Care instructions")
    total_quantity: Optional[int] = Field(None, description="Total quantity available")
    images_id: Optional[List[UUID]] = Field(
        None, description="List of image identifiers"
    )
