# main.py
from fastapi import FastAPI
from routers import user_router, post_router, comment_router

app = FastAPI(title="JUNGLE-BOARD")

# 각 라우터 등록
app.include_router(user_router.router)
app.include_router(post_router.router)
app.include_router(comment_router.router)



@app.get("/")
def root():
    return {"message": "Hello FastAPI!"}
