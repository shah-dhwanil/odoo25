from typing import Annotated, Optional

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pyseto import VerifyError

from app.users.models import UserPayload, UserType
from app.utils.paseto import verify_token

bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(bearer)],
) -> UserPayload:
    if credentials is None or credentials.credentials is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        payload = verify_token(credentials.credentials)

    except VerifyError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return UserPayload(**payload)


class RequiresRole:
    def __init__(self, *required_role: UserType):
        self.required_roles = required_role

    async def __call__(
        self,
        user: Annotated[UserPayload, Depends(get_current_user)],
    ) -> None:
        if user.role in self.required_roles:
            return user
        else:
            raise HTTPException(status_code=403, detail="Not enough permissions")
