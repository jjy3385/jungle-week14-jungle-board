import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from .routers import user_router, post_router, comment_router, guestbook_router
from .database import get_client, close


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 앱 시작 시 MongoDB 클라이언트 미리 생성
    await get_client()
    # 여기에서 실제 FastAPI 요청 처리가 진행됨
    yield
    # 앱 종료 시 열린 클라이언트 정리
    await close()


app = FastAPI(title="JUNGLE-BOARD")

# CORS 설정
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # 페이징 관련 추가헤더
    expose_headers=["X-Total-Count"],
)

# Starlette 세션 미들웨어: 서명된 쿠키에 세션 데이터 저장
session_secret = os.getenv("SESSION_SECRET", "dev-secret")
app.add_middleware(SessionMiddleware, secret_key=session_secret)

# 각 라우터 등록
app.include_router(user_router.router)
app.include_router(user_router.protected_user_router)
app.include_router(post_router.router)
app.include_router(comment_router.router)
app.include_router(guestbook_router.router)


@app.get("/")
def root():
    return {"message": "Hello FastAPI!"}
