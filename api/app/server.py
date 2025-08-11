from granian.constants import Interfaces, Loops
from granian.log import LogLevels
from granian.server import Server

from app.config import Config

config = Config()
server = Server(
    target="app.main:app",
    interface=Interfaces.ASGI,
    address=config.SERVER_ADDRESS,
    port=config.SERVER_PORT,
    log_access=True if config.SERVER_ENVIRONMENT == "DEV" else False,
    log_level=LogLevels.debug if config.SERVER_ENVIRONMENT == "DEV" else LogLevels.info,
    loop=Loops.uvloop,
)
server.serve()
