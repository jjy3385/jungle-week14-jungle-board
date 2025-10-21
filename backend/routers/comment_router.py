from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Request, status
from bson import ObjectId
from bson.errors import InvalidId
from ..database import get_db
from ..schemas.comment_schema import Comment, CommentCreate, CommentUpdate

router = APIRouter(prefix="/comments", tags=["comments"])


async def comments_collection(db=Depends(get_db)):
    return db["comments"]


def serialize_comment(doc: dict) -> Comment:
    return Comment(
        id=str(doc["_id"]),
        postId=doc["postId"],
        author=doc["author"],
        content=doc["content"],
        createdAt=doc["createdAt"],
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


@router.get("/{post_id}", response_model=list[Comment])
async def get_comments(post_id: str, comments=Depends(comments_collection)):
    docs = await comments.find({"postId": post_id}).to_list(length=None)
    return [serialize_comment(doc) for doc in docs]


@router.post("/", response_model=Comment, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment: CommentCreate,
    request: Request,
    comments=Depends(comments_collection),
):
    _, username = require_session_user(request)

    payload = comment.model_dump()
    payload["author"] = username
    payload["createdAt"] = datetime.now(timezone.utc).isoformat()

    result = await comments.insert_one(payload)
    new_doc = await comments.find_one({"_id": result.inserted_id})
    return serialize_comment(new_doc)


@router.put("/{comment_id}", response_model=Comment)
async def update_comment(
    comment_id: str,
    updated: CommentUpdate,
    request: Request,
    comments=Depends(comments_collection),
):
    _, username = require_session_user(request)
    filter_query = {"_id": to_object_id(comment_id), "author": username}

    update_result = await comments.update_one(
        filter_query, {"$set": {"content": updated.content}}
    )
    if update_result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="본인 댓글이 아니거나 존재하지 않습니다.",
        )

    refreshed = await comments.find_one({"_id": to_object_id(comment_id)})
    return serialize_comment(refreshed)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: str, request: Request, comments=Depends(comments_collection)
):
    _, username = require_session_user(request)
    result = await comments.delete_one(
        {"_id": to_object_id(comment_id), "author": username}
    )
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="본인 댓글이 아니거나 존재하지 않습니다.",
        )
    return None
