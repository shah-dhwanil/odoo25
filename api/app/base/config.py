from os import environ
from tomllib import load
from typing import Any, Optional

from dotenv import load_dotenv
from pydantic import BaseModel

__config__: Optional[dict[str, Any]] = None


class BaseConfig(BaseModel):
    @staticmethod
    def load_config():
        load_dotenv("./.env")
        environment = environ.get("SERVER_ENVIRONMENT", None)
        if environment is None:
            raise ValueError("Server Environment must be set in the system")
        load_dotenv(f".env.{environment.lower()}")
        config = dict()
        with open("./config.toml", "rb") as f:
            toml_config = load(f)
            config.update(toml_config.get("DEFAULT", dict()))
            config.update(toml_config.get(environment, dict()))
        config.update(environ)
        global __config__
        __config__ = config

    def __init__(self, *args, **kwargs):
        global __config__
        if __config__ is None:
            self.load_config()
        super().__init__(**__config__)
