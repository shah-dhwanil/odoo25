from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.categories.controller import router as categories_router
from app.lifespan import lifespan
from app.middleware import ContextMiddleware, LoggingMiddleware, RequestIDMiddleware
from app.shop_owner.controller import router as shop_owner_router
from app.users.controller import router as users_router


def create_app():
    app = FastAPI(title="CMS", lifespan=lifespan)
    # app.add_exception_handler(HTTPException, http_exception_handler)
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

    # Include routers
    app.include_router(users_router)
    app.include_router(categories_router)
    app.include_router(shop_owner_router)

    @app.get("/")
    async def health_check():
        return {"status": "ok"}

    return app


app = create_app()
