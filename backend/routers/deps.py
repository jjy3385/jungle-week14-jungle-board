# 공통 로그인 의존성
from fastapi import Depends, HTTPException, Request, status
from bson import ObjectId
from ..database import get_db


async def get_users_collection(db=Depends(get_db)):
    return db["users"]


async def require_user(request: Request, users=Depends(get_users_collection)):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="로그인이 필요합니다."
        )
    doc = await users.find_one({"_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="세션이 유효하지 않습니다."
        )
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc
