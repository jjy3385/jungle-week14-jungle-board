from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    HTTPException,
    Query,
    Request,
    Response,
    status,
)
from bson import ObjectId
from bson.errors import InvalidId
from ..database import get_db
from ..schemas.post_schema import Post, PostCreate

router = APIRouter(prefix="/posts", tags=["posts"])


async def posts_collection(db=Depends(get_db)):
    return db["posts"]


def serialize_post(doc: dict) -> Post:
    return Post(
        id=str(doc["_id"]),
        title=doc["title"],
        content=doc["content"],
        author=doc["author"],
    )


def require_session_user(request: Request) -> tuple[str, str]:
    user_id = request.session.get("user_id")
    username = request.session.get("username")
    if not user_id or not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="로그인이 필요합니다."
        )
    return user_id, username


def to_object_id(doc_id: str) -> ObjectId:
    try:
        return ObjectId(doc_id)
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="잘못된 식별자 형식입니다."
        )


@router.get("/", response_model=list[Post])
async def get_posts(
    response: Response,
    page: int = Query(1, ge=1, alias="_page"),
    limit: int = Query(10, ge=1, le=100, alias="_limit"),
    posts=Depends(posts_collection),
):
    skip = (page - 1) * limit

    docs = (
        await posts.find().sort("_id", -1).skip(skip).limit(limit).to_list(length=limit)
    )
    total = await posts.count_documents({})
    response.headers["X-Total-Count"] = str(total)
    return [serialize_post(doc) for doc in docs]


@router.post("/", response_model=Post, status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostCreate, request: Request, posts=Depends(posts_collection)
):
    _, username = require_session_user(request)

    payload = post.model_dump()
    payload["author"] = username

    result = await posts.insert_one(payload)
    new_doc = await posts.find_one({"_id": result.inserted_id})
    return serialize_post(new_doc)


@router.get("/{post_id}", response_model=Post)
async def get_post(post_id: str, posts=Depends(posts_collection)):
    doc = await posts.find_one({"_id": to_object_id(post_id)})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="게시글이 없습니다."
        )
    return serialize_post(doc)


@router.put("/{post_id}", response_model=Post)
async def update_post(
    post_id: str, updated: PostCreate, request: Request, posts=Depends(posts_collection)
):
    _, username = require_session_user(request)
    filter_query = {"_id": to_object_id(post_id)}

    doc = await posts.find_one(filter_query)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="게시글이 없습니다."
        )
    if doc["author"] != username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="본인 글만 수정할 수 있습니다.",
        )

    update_payload = updated.model_dump()
    update_payload["author"] = username
    await posts.update_one(filter_query, {"$set": update_payload})

    refreshed = await posts.find_one(filter_query)
    return serialize_post(refreshed)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: str, request: Request, posts=Depends(posts_collection)):
    _, username = require_session_user(request)
    filter_query = {"_id": to_object_id(post_id)}

    doc = await posts.find_one(filter_query)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="게시글이 없습니다."
        )
    if doc["author"] != username:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="본인 글만 삭제할 수 있습니다.",
        )
    await posts.delete_one(filter_query)
    return None
