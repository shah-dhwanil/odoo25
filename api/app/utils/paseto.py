from app.config import Config
from pyseto import Key,encode,decode
import orjson

config = Config()
key = Key.new(version=4, purpose="local", key=config.PASETO_KEY.encode("UTF-8"))

def generate_token(payload):
    token = encode(
        key,
        payload=payload,
        serializer=orjson,
        implicit_assertion=b"odoo",  # Optional
        exp=config.PASETO_EXP
    )
    return token

def verify_token(token):
    payload = decode(key, token, implicit_assertion=b"odoo",deserializer=orjson)
    return payload