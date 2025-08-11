from typing import Any, Optional

from app.base.exceptions import BaseException


class CategoryNotFound(BaseException):
    code = "CATEGORY_NOT_FOUND"
    title = "Category Not Found"

    def __init__(
        self,
        detail: str = "The requested category was not found",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)


class CategoryAlreadyExists(BaseException):
    code = "CATEGORY_ALREADY_EXISTS"
    title = "Category Already Exists"

    def __init__(
        self,
        detail: str = "A category with this name already exists",
        context: Optional[dict[str, Any]] = None,
        *args: object,
    ) -> None:
        super().__init__(detail, context, *args)
