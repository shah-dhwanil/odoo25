from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.categories.controller import router as categories_router
from app.customers.controller import router as customers_router
from app.delivery_partner.controller import router as delivery_partner_router
from app.lifespan import lifespan
from app.middleware import ContextMiddleware, LoggingMiddleware, RequestIDMiddleware
from app.orders.controller import router as orders_router
from app.products.controller import router as products_router
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
    app.include_router(customers_router)
    app.include_router(delivery_partner_router)
    app.include_router(products_router)
    app.include_router(orders_router)

    @app.get("/")
    async def health_check():
        return {"status": "ok"}

    return app


app = create_app()
