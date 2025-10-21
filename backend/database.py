import os
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

_client: AsyncIOMotorClient | None = None


async def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        uri = os.getenv("MONGODB_URI")
        if not uri:
            raise RuntimeError("MONGODB_URI is not set")
        _client = AsyncIOMotorClient(uri)
    return _client


async def get_db():
    client = await get_client()
    db_name = os.getenv("MONGODB_DB", "jungle-board")
    return client[db_name]


async def close():
    global _client
    if _client:
        _client.close()
        _client = None
