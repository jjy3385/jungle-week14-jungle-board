from pydantic import BaseModel


class CommentCreate(BaseModel):
    postId: str
    content: str


class CommentUpdate(BaseModel):
    content: str


class Comment(BaseModel):
    id: str
    postId: str
    author: str
    content: str
    createdAt: str
