from typing import Any, Optional

from app.base.exceptions import BaseException


class ProductNotFound(BaseException):
    code = "PRODUCT_NOT_FOUND"
    title = "Product Not Found"

    def __init__(
        self,
        detail: str = "The requested product was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class ProductAlreadyExists(BaseException):
    code = "PRODUCT_ALREADY_EXISTS"
    title = "Product Already Exists"

    def __init__(
        self,
        detail: str = "A product with this name already exists for this owner",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class ProductDeleted(BaseException):
    code = "PRODUCT_DELETED"
    title = "Product Deleted"

    def __init__(
        self,
        detail: str = "The requested product has been deleted",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InsufficientQuantity(BaseException):
    code = "INSUFFICIENT_QUANTITY"
    title = "Insufficient Quantity"

    def __init__(
        self,
        detail: str = "Not enough available quantity for the requested operation",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InvalidRentalUnit(BaseException):
    code = "INVALID_RENTAL_UNIT"
    title = "Invalid Rental Unit"

    def __init__(
        self,
        detail: str = "The specified rental unit is not available for this product",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class InvalidPriceConfiguration(BaseException):
    code = "INVALID_PRICE_CONFIGURATION"
    title = "Invalid Price Configuration"

    def __init__(
        self,
        detail: str = "Price configuration does not match available rental units",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class ProductOwnerMismatch(BaseException):
    code = "PRODUCT_OWNER_MISMATCH"
    title = "Product Owner Mismatch"

    def __init__(
        self,
        detail: str = "You are not authorized to perform this operation on this product",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)
