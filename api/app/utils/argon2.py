from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from app.config import Config

config = Config()
argon2 = PasswordHasher(
    time_cost=config.ARGON_TIME_COST,
    memory_cost=config.ARGON_MEMORY_COST,
    parallelism=config.ARGON_PARALLELISM,
    hash_len=config.ARGON_HASH_LENGTH,
    salt_len=config.ARGON_SALT_LENGTH,
)


def hash_password(password: str) -> str:
    global argon2
    return argon2.hash(password)


def verify_password(
    hashed_password: str,
    raw_password: str,
):
    global argon2
    try:
        return argon2.verify(hashed_password, raw_password)
    except VerifyMismatchError:
        return False