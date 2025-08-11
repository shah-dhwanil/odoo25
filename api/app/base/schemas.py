from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


class HTTPExceptionResponse(BaseModel):
    code: str
    title: str
    status_code: int
    detail: str
    instance: Optional[str] = None
    context: Optional[dict[str, Any]] = None
    model_config = ConfigDict(from_attributes=True)


class Address(BaseModel):
    street: str = Field(..., description="Street address")
    city: str = Field(..., description="City")
    state: str = Field(..., description="State")
    pincode: str = Field(..., description="Postal/PIN code", max_length=6, min_length=6)
    country: str = Field(..., description="Country")
