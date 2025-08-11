from typing import Any, Optional

from app.base.exceptions import BaseException


class ShopOwnerNotFound(BaseException):
    code = "SHOP_OWNER_NOT_FOUND"
    title = "Shop Owner Not Found"

    def __init__(
        self,
        detail: str = "The requested shop owner was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class ShopOwnerAlreadyExists(BaseException):
    code = "SHOP_OWNER_ALREADY_EXISTS"
    title = "Shop Owner Already Exists"

    def __init__(
        self,
        detail: str = "A shop owner with this identifier already exists",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class ShopOwnerGSTAlreadyExists(BaseException):
    code = "SHOP_OWNER_GST_ALREADY_EXISTS"
    title = "Shop Owner GST Already Exists"

    def __init__(
        self,
        detail: str = "A shop owner with this GST number already exists",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)
