from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class HTTPExceptionResponse(BaseModel):
    code: str
    title: str
    status_code: int
    detail: str
    instance: Optional[str] = None
    context: Optional[dict[str, Any]] = None
    model_config = ConfigDict(from_attributes=True)
