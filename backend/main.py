# main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from .routers import user_router, post_router, comment_router
from .database import get_client, close


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_client()
    yield
    await close()


app = FastAPI(title="JUNGLE-BOARD")

# CORS 설정
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)

app.add_middleware(SessionMiddleware, secret_key="jungle")

# 각 라우터 등록
app.include_router(user_router.router)
app.include_router(post_router.router)
app.include_router(comment_router.router)


@app.get("/")
def root():
    return {"message": "Hello FastAPI!"}
