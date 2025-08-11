from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field
from pydantic_extra_types.phone_numbers import PhoneNumber


class UserType(str, Enum):
    """Enum for user types matching the database UserType enum"""

    ADMIN = "ADMIN"
    SHOP_OWNER = "SHOP_OWNER"
    DELIVERY_PARTNER = "DELIVERY_PARTNER"
    CUSTOMER = "CUSTOMER"


class UserBase(BaseModel):
    """Base user schema with common fields"""

    email_id: EmailStr = Field(..., max_length=64, description="User's email address")
    mobile_no: PhoneNumber = Field(..., description="User's mobile number")
    user_type: UserType = Field(..., description="Type of user")


class UserCreate(UserBase):
    """Schema for creating a new user"""

    password: str = Field(
        ..., min_length=8, max_length=500, description="User's password"
    )


class UserInDB(UserBase):
    """Complete user model matching database structure"""

    id: UUID = Field(..., description="User's unique identifier")
    password: str = Field(..., description="Hashed password")
    is_deleted: bool = Field(default=False, description="Soft delete flag")
    created_at: datetime = Field(..., description="User creation timestamp")

    class Config:
        from_attributes = True


class UserResponse(UserBase):
    """Public user response schema (excludes sensitive data)"""

    id: UUID = Field(..., description="User's unique identifier")
    is_deleted: bool = Field(default=False, description="Soft delete flag")
    created_at: datetime = Field(..., description="User creation timestamp")

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Schema for user authentication"""

    email_id: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")


class UserListResponse(BaseModel):
    """Schema for paginated user listings"""

    users: list[UserResponse]
    total: int
    page: int
    page_size: int


class UserPasswordUpdate(BaseModel):
    """Schema for password update operations"""

    current_password: str = Field(..., description="Current password")
    new_password: str = Field(
        ..., min_length=8, max_length=500, description="New password"
    )


class UserPayload(BaseModel):
    id: UUID
    role: UserType


class UserAuthResponse(BaseModel):
    access_token: str
    role: UserType
