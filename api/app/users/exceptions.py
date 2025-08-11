from typing import Any, Optional
from uuid import UUID

from app.base.exceptions import BaseException


class UserNotFoundException(BaseException):
    """Raised when a user is not found"""

    code = "USER_NOT_FOUND"
    title = "User Not Found"

    def __init__(
        self,
        user_id: Optional[UUID] = None,
        email: Optional[str] = None,
        context: Optional[dict[str, Any]] = None,
    ):
        if user_id:
            detail = f"User with ID '{user_id}' not found"
        elif email:
            detail = f"User with email '{email}' not found"
        else:
            detail = "User not found"

        super().__init__(detail, context)


class EmailAlreadyExistsException(BaseException):
    """Raised when trying to use an email that already exists"""

    code = "EMAIL_ALREADY_EXISTS"
    title = "Email Already Exists"

    def __init__(self, email: str, context: Optional[dict[str, Any]] = None):
        detail = f"Email '{email}' is already registered"
        super().__init__(detail, context)


class MobileNumberAlreadyExistsException(BaseException):
    """Raised when trying to use a mobile number that already exists"""

    code = "MOBILE_NUMBER_ALREADY_EXISTS"
    title = "Mobile Number Already Exists"

    def __init__(self, mobile_no: str, context: Optional[dict[str, Any]] = None):
        detail = f"Mobile number '{mobile_no}' is already registered"
        super().__init__(detail, context)
