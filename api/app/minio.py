from miniopy_async import Minio

from app.config import Config


class MinioClient:
    @staticmethod
    def get_client() -> Minio:
        config = Config()
        client = Minio(
            config.MINIO_ADDRESS,
            access_key=config.MINIO_ACCESS_KEY,
            secret_key=config.MINIO_SECRET_KEY,
            secure=config.MINIO_SECURE,
        )
        return client
