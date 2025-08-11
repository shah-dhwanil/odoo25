from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class Category(BaseModel):
    id: UUID = Field(..., description="The unique identifier of the category")
    name: str = Field(..., description="The name of the category")
    description: str = Field(..., description="The description of the category")
    created_at: datetime


class CreateCategory(BaseModel):
    name: str = Field(..., description="The name of the category")
    description: str = Field(..., description="The description of the category")


class ListCategory(BaseModel):
    categories: list[Category]


class UpdateCategory(BaseModel):
    name: str = Field(..., description="The name of the category")
    description: str = Field(..., description="The description of the category")
