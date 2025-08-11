from typing import Optional

from app.base.config import BaseConfig


class Config(BaseConfig):
    SERVER_ENVIRONMENT: str
    SERVER_ADDRESS: str
    SERVER_PORT: int
    POSTGRES_HOST_ADDRESS: str
    POSTGRES_PORT: Optional[int] = 5432
    POSTGRES_USERNAME: str
    POSTGRES_PWD: str
    POSTGRES_DB: str
    POSTGRES_MIN_CONNECTIONS: int = 2
    POSTGRES_MAX_CONNECTIONS: int = 2
    SENTRY_URL: str
    ARGON_TIME_COST: int
    ARGON_MEMORY_COST: int
    ARGON_PARALLELISM: int
    ARGON_SALT_LENGTH: int
    ARGON_HASH_LENGTH: int
    PASETO_KEY: str
    PASETO_EXP: int = 900
    MINIO_ADDRESS: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str
    MINIO_SECURE: bool
