from app.middleware import ContextMiddleware, LoggingMiddleware, RequestIDMiddleware
from fastapi import FastAPI

from app.base.exception_handler import http_exception_handler
from app.base.exceptions import HTTPException
from app.lifespan import lifespan
from fastapi.middleware.cors import CORSMiddleware


def create_app():
    app = FastAPI(title="CMS", lifespan=lifespan)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(ContextMiddleware)
    app.add_middleware(RequestIDMiddleware)
    app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
    )

    @app.get("/")
    async def health_check():
        return {"status": "ok"}

    return app


app = create_app()
