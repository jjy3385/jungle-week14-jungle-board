from fastapi import (
    APIRouter,
    Depends,
    Request,
    status,
    WebSocket,
    WebSocketDisconnect,
)
from datetime import datetime, timezone
from ..database import get_db
from ..schemas.guestbook_schema import GuestbookCreate, GuestbookEntry
from .deps import require_user

router = APIRouter(
    prefix="/guestbook", tags=["guestbook"], dependencies=[Depends(require_user)]
)


class ConnectionManager:
    def __init__(self):
        self.active: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active.discard(websocket)

    async def broadcast(self, data: dict):
        for connection in list(self.active):
            try:
                await connection.send_json(data)
            except WebSocketDisconnect:
                self.disconnect(connection)


manager = ConnectionManager()


async def guestbook_collection(db=Depends(get_db)):
    return db["guestbook"]


def serialize_entry(doc) -> GuestbookEntry:
    return GuestbookEntry(
        id=str(doc["_id"]),
        author=doc.get("author"),
        message=doc["message"],
        mood=doc.get("mood"),
        color=doc.get("color"),
        createdAt=doc["createdAt"],
    )


@router.get("/", response_model=list[GuestbookEntry])
async def list_entries(limit: int = 50, guestbook=Depends(guestbook_collection)):
    docs = await guestbook.find().sort("_id", -1).limit(limit).to_list(length=limit)
    return [serialize_entry(doc) for doc in docs]


@router.post("/", response_model=GuestbookEntry, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry: GuestbookCreate,
    request: Request,
    guestbook=Depends(guestbook_collection),
):
    author = entry.author or request.session.get("username") or "익명 방문자"
    payload = entry.model_dump()
    payload["author"] = author
    payload["createdAt"] = datetime.now(timezone.utc).isoformat()

    result = await guestbook.insert_one(payload)
    new_doc = await guestbook.find_one({"_id": result.inserted_id})
    serialized = serialize_entry(new_doc)
    await manager.broadcast({"type": "guestbook:new", "data": serialized.model_dump()})
    return serialized


@router.websocket("/ws/guestbook")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
