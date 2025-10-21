from fastapi import APIRouter, HTTPException
from schemas.post_schema import Post, PostCreate
from uuid import uuid4

router = APIRouter(prefix="/posts", tags=["posts"])

posts = [
    {
        "id": "1",
        "title": "제목입니다 1",
        "content": "React 게시판을 시작합니다.!!!!",
        "author": "jjy3385",
    }
]


@router.get("/", response_model=list[Post])
def get_posts():
    return posts


@router.post("/", response_model=Post)
def create_post(post: PostCreate):
    new_post = {"id": str(uuid4())[:4], **post.model_dump()}
    posts.append(new_post)
    return new_post


@router.get("/{post_id}", response_model=Post)
def get_post(post_id: str):
    post = next((p for p in posts if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="게시글이 없습니다.")
    return post


@router.put("/{post_id}", response_model=Post)
def update_post(post_id: str, updated: PostCreate):
    for p in posts:
        if p["id"] == post_id:
            p.update(updated.model_dump())
            return p
    raise HTTPException(status_code=404, detail="게시글이 없습니다.")


@router.delete("/{post_id}")
def delete_post(post_id: str):
    global posts
    posts = [p for p in posts if p["id"] != post_id]
    return {"message": "게시글 삭제"}
