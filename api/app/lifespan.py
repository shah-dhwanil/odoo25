from contextlib import asynccontextmanager
from phonenumbers import PhoneNumber
from app.database import PgPool
from app.logging import setup_logging
from app.sentry import init_sdk

@asynccontextmanager
async def lifespan(app):
    PhoneNumber.phone_format = "INTERNATIONAL"
    PhoneNumber.default_region_code = "IN"
    init_sdk()
    setup_logging()
    await PgPool.initiate()
    yield
    await PgPool.close()