from pydantic import BaseModel


class PostBase(BaseModel):
    title: str
    content: str
    author: str


class PostCreate(PostBase):
    pass


class Post(PostBase):
    id: str
