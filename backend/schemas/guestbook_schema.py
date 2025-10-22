from pydantic import BaseModel


class GuestbookCreate(BaseModel):
    author: str | None = None
    message: str
    mood: str | None = None
    color: str | None = None


class GuestbookEntry(GuestbookCreate):
    id: str
    createdAt: str
