from fastapi import APIRouter, HTTPException
from schemas.comment_schema import Comment, CommentCreate, CommentUpdate
from uuid import uuid4
from datetime import datetime, timezone

router = APIRouter(prefix="/comments", tags=["comments"])

comments = [
    {
        "id": "53b4",
        "postId": "3efa",
        "author": "jjy3385",
        "content": "댓글테스트 수정",
        "createdAt": "2025-10-20T14:31:33.572Z",
    }
]


@router.get("/{post_id}", response_model=list[Comment])
def get_comments(post_id: str):
    return [c for c in comments if c["postId"] == post_id]


@router.post("/", response_model=Comment)
def create_comment(comment: CommentCreate):
    new_comment = {
        "id": str(uuid4())[:4],
        **comment.model_dump(),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    comments.append(new_comment)
    return new_comment


@router.put("/{comment_id}", response_model=Comment)
def update_comment(comment_id: str, updated: CommentUpdate):
    for c in comments:
        if c["id"] == comment_id:
            c["content"] = updated.content
            return c
    raise HTTPException(status_code=404, detail="댓글을 찾지 못했습니다.")


@router.delete("/{comment_id}")
def delete_comment(comment_id: str):
    global comments
    before = len(comments)
    comments = [c for c in comments if c["id"] != comment_id]
    if len(comments) == before:
        raise HTTPException(status_code=404, detail="댓글을 찾지 못했습니다.")
    return {"message": "댓글 삭제"}
