from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from app.base.schemas import Address


class BankDetails(BaseModel):
    account_number: str = Field(..., description="Bank account number")
    ifsc_code: str = Field(..., description="IFSC code")
    bank_name: str = Field(..., description="Bank name")
    branch: str = Field(..., description="Branch name")


class ShopOwner(BaseModel):
    id: UUID = Field(..., description="The unique identifier of the shop owner")
    name: str = Field(..., description="The name of the shop")
    owner_name: str = Field(..., description="The name of the shop owner")
    gst_no: str = Field(..., description="GST number (15 characters)")
    address: Address = Field(..., description="Shop address details")
    bank_details: BankDetails = Field(..., description="Bank account details")
    is_deleted: bool = Field(default=False, description="Soft delete flag")
    created_at: datetime


class CreateShopOwner(BaseModel):
    id: UUID
    name: str = Field(..., description="The name of the shop", max_length=128)
    owner_name: str = Field(
        ..., description="The name of the shop owner", max_length=64
    )
    gst_no: str = Field(
        ..., description="GST number (15 characters)", min_length=15, max_length=15
    )
    address: Address = Field(..., description="Shop address details")
    bank_details: BankDetails = Field(..., description="Bank account details")


class ListShopOwner(BaseModel):
    shop_owners: list[ShopOwner]


class UpdateShopOwner(BaseModel):
    name: str = Field(..., description="The name of the shop", max_length=128)
    owner_name: str = Field(
        ..., description="The name of the shop owner", max_length=64
    )
    gst_no: str = Field(
        ..., description="GST number (15 characters)", min_length=15, max_length=15
    )
    address: Address = Field(..., description="Shop address details")
    bank_details: BankDetails = Field(..., description="Bank account details")
