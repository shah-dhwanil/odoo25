from miniopy_async import Minio
from orjson import dumps

from app.config import Config


class MinioClient:
    @staticmethod
    async def make_sure_buckets_are_present(client: Minio):
        print("Checking if buckets exist...")
        if not await client.bucket_exists("products"):
            await client.make_bucket("products")
            await client.set_bucket_policy(
                "products",
                dumps(
                    {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Effect": "Allow",
                                "Principal": {"AWS": ["*"]},
                                "Action": ["s3:GetObject"],
                                "Resource": ["arn:aws:s3:::products/*"],
                            }
                        ],
                    }
                ),
            )
        if not await client.bucket_exists("drop-pics"):
            await client.make_bucket("drop-pics")
            await client.set_bucket_policy(
                "drop-pics",
                dumps(
                    {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Effect": "Allow",
                                "Principal": {"AWS": ["*"]},
                                "Action": ["s3:GetObject"],
                                "Resource": ["arn:aws:s3:::drop-pics/*"],
                            }
                        ],
                    }
                ),
            )
        if not await client.bucket_exists("pickup-pics"):
            await client.make_bucket("pickup-pics")
            await client.set_bucket_policy(
                "pickup-pics",
                dumps(
                    {
                        "Version": "2012-10-17",
                        "Statement": [
                            {
                                "Effect": "Allow",
                                "Principal": {"AWS": ["*"]},
                                "Action": ["s3:GetObject"],
                                "Resource": ["arn:aws:s3:::pickup-pics/*"],
                            }
                        ],
                    }
                ),
            )

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
