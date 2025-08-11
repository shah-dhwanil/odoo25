from typing import Any, Optional

from app.base.exceptions import BaseException


class OrderNotFound(BaseException):
    code = "ORDER_NOT_FOUND"
    title = "Order Not Found"

    def __init__(
        self,
        detail: str = "The requested order was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class OrderAlreadyExists(BaseException):
    code = "ORDER_ALREADY_EXISTS"
    title = "Order Already Exists"

    def __init__(
        self,
        detail: str = "An order with this ID already exists",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InsufficientStock(BaseException):
    code = "INSUFFICIENT_STOCK"
    title = "Insufficient Stock"

    def __init__(
        self,
        detail: str = "Insufficient stock available for the order",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InvalidOrderStatus(BaseException):
    code = "INVALID_ORDER_STATUS"
    title = "Invalid Order Status"

    def __init__(
        self,
        detail: str = "The order status transition is not allowed",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InvalidPaymentStatus(BaseException):
    code = "INVALID_PAYMENT_STATUS"
    title = "Invalid Payment Status"

    def __init__(
        self,
        detail: str = "The payment status transition is not allowed",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InvalidRentDates(BaseException):
    code = "INVALID_RENT_DATES"
    title = "Invalid Rent Dates"

    def __init__(
        self,
        detail: str = "Rent start date must be before rent end date",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InvalidDeliveryDates(BaseException):
    code = "INVALID_DELIVERY_DATES"
    title = "Invalid Delivery Dates"

    def __init__(
        self,
        detail: str = "Delivery and pickup dates must be within the rental period",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InsufficientPayment(BaseException):
    code = "INSUFFICIENT_PAYMENT"
    title = "Insufficient Payment"

    def __init__(
        self,
        detail: str = "Payment amount is insufficient for the order total",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class OrderNotCancellable(BaseException):
    code = "ORDER_NOT_CANCELLABLE"
    title = "Order Not Cancellable"

    def __init__(
        self,
        detail: str = "Order cannot be cancelled in its current status",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class ProductNotAvailable(BaseException):
    code = "PRODUCT_NOT_AVAILABLE"
    title = "Product Not Available"

    def __init__(
        self,
        detail: str = "The requested product is not available for the specified dates",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)
