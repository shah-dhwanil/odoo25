from typing import Any, Optional

from app.base.exceptions import BaseException


class DeliveryNotFound(BaseException):
    code = "DELIVERY_NOT_FOUND"
    title = "Delivery Not Found"

    def __init__(
        self,
        detail: str = "The requested delivery was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class DeliveryAlreadyExists(BaseException):
    code = "DELIVERY_ALREADY_EXISTS"
    title = "Delivery Already Exists"

    def __init__(
        self,
        detail: str = "A delivery for this order already exists",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InvalidDeliveryRating(BaseException):
    code = "INVALID_DELIVERY_RATING"
    title = "Invalid Delivery Rating"

    def __init__(
        self,
        detail: str = "Delivery rating must be between 1 and 5",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class DeliveryPartnerNotFound(BaseException):
    code = "DELIVERY_PARTNER_NOT_FOUND"
    title = "Delivery Partner Not Found"

    def __init__(
        self,
        detail: str = "The specified delivery partner was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class OrderNotFound(BaseException):
    code = "ORDER_NOT_FOUND"
    title = "Order Not Found"

    def __init__(
        self,
        detail: str = "The specified order was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)
