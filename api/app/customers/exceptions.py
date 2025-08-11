from typing import Any, Optional

from app.base.exceptions import BaseException


class CustomerNotFound(BaseException):
    code = "CUSTOMER_NOT_FOUND"
    title = "Customer Not Found"

    def __init__(
        self,
        detail: str = "The requested customer was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class CustomerAlreadyExists(BaseException):
    code = "CUSTOMER_ALREADY_EXISTS"
    title = "Customer Already Exists"

    def __init__(
        self,
        detail: str = "A customer with this identifier already exists",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)
