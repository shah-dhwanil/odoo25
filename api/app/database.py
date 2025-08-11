from json import dumps, loads
from typing import ClassVar, Optional

from asyncpg import Pool, create_pool

from .config import Config


class PgPool:
    pool: ClassVar[Optional[Pool]] = None

    @classmethod
    async def initiate(cls) -> None:
        if cls.pool is not None:
            return
        config = Config()

        async def init_connection(connection):
            await connection.set_type_codec(
                "json",
                encoder=dumps,
                decoder=loads,
                schema="pg_catalog",
            )

        cls.pool = await create_pool(
            user=config.POSTGRES_USERNAME,
            password=config.POSTGRES_PWD,
            database=config.POSTGRES_DB,
            host=config.POSTGRES_HOST_ADDRESS,
            port=config.POSTGRES_PORT,
            min_size=config.POSTGRES_MIN_CONNECTIONS,
            max_size=config.POSTGRES_MAX_CONNECTIONS,
            init=init_connection,
        )

    @classmethod
    async def get_connection(cls):
        if cls.pool is None:
            raise Exception("Pool not initiated")
        try:
            client = await cls.pool.acquire()
            yield client
        except Exception:
            await cls.pool.release(client)
            raise

    @classmethod
    async def close(cls):
        if cls.pool is None:
            return
        await cls.pool.close()
