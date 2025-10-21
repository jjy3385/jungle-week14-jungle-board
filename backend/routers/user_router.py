from fastapi import APIRouter, HTTPException, Depends, Request, status
from ..schemas.user_schema import User, UserCreate, UserLogin
from ..database import get_db
from ..utils.password import hash_password, verify_password
from bson import ObjectId

router = APIRouter(tags=["users"])


async def get_users_collection(db=Depends(get_db)):
    return db["users"]


@router.post("/signup", response_model=User)
async def signup(user: UserCreate, users=Depends(get_users_collection)):
    if await users.find_one({"username": user.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="중복 회원입니다."
        )

    payload = user.model_dump()
    payload["password"] = hash_password(payload["password"])
    result = await users.insert_one(payload)
    return {"id": str(result.inserted_id), **payload, "password": None}


@router.post("/login")
async def login(
    login_data: UserLogin, request: Request, users=Depends(get_users_collection)
):
    doc = await users.find_one({"username": login_data.username})
    if not doc or not verify_password(login_data.password, doc["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="아이디 또는 비밀번호가 잘못됐습니다.",
        )
    request.session["user_id"] = str(doc["_id"])
    request.session["username"] = doc["username"]
    return {"message": "로그인 성공"}


@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "로그아웃 성공"}


@router.get("/users/me", response_model=User)
async def me(request: Request, users=Depends(get_users_collection)):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
    doc = await users.find_one({"_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return {"id": str(doc["_id"]), "username": doc["username"], "email": doc["email"]}
