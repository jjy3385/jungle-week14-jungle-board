from pydantic import BaseModel


class CommentBase(BaseModel):
    postId: str
    author: str
    content: str


class CommentCreate(CommentBase):
    pass


class CommentUpdate(BaseModel):
    content: str


class Comment(CommentBase):
    id: str
    createdAt: str
