from typing import Any, Optional


class BaseException(Exception):
    code: str
    title: str

    def __init__(
        self, detail: str, context: Optional[dict[str, Any]] = None, *args: object
    ) -> None:
        self.detail = detail
        self.context = context
        super().__init__(*args)


class HTTPException(BaseException):
    # Heavily inspired from RFC 7807
    def __init__(
        self, status_code: int, error: BaseException, instance: Optional[str] = None
    ):
        self.status_code = status_code
        self.code = error.code
        self.title = error.title
        self.detail = error.detail
        self.instance = instance
        self.context = error.context
