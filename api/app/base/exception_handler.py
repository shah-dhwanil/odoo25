from fastapi.responses import JSONResponse

from app.base.exceptions import HTTPException
from app.base.schemas import HTTPExceptionResponse


def http_exception_handler(exception: HTTPException):
    return JSONResponse(
        status_code=exception.status_code,
        content=HTTPExceptionResponse.model_validate(exception).model_dump(),
    )
