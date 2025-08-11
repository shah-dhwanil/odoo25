from typing import Any, Optional

from app.base.exceptions import BaseException


class DeliveryPartnerNotFound(BaseException):
    code = "DELIVERY_PARTNER_NOT_FOUND"
    title = "Delivery Partner Not Found"

    def __init__(
        self,
        detail: str = "The requested delivery partner was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class DeliveryPartnerAlreadyExists(BaseException):
    code = "DELIVERY_PARTNER_ALREADY_EXISTS"
    title = "Delivery Partner Already Exists"

    def __init__(
        self,
        detail: str = "A delivery partner with this identifier already exists",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)
