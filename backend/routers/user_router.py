from fastapi import APIRouter, HTTPException
from schemas.user_schema import User, UserCreate, UserLogin
from uuid import uuid4

router = APIRouter(tags=["users"])

# 임시 데이터
users = [
    {"id": "1", "username": "jjy3385", "email": "jjy3386@gmail.com", "password": "1234"}
]


@router.post("/signup", response_model=User)
def signup(user: UserCreate):
    if any(u["username"] == user.username for u in users):
        raise HTTPException(status_code=400, detail="중복회원입니다.")

    new_user = {"id": str(uuid4())[:4], **user.model_dump()}
    users.append(new_user)
    return new_user


@router.post("/login")
def login(login_data: UserLogin):
    for u in users:
        if (
            u["username"] == login_data.username
            and u["password"] == login_data.password
        ):
            return {"message": "로그인 성공", "user": u}
        return HTTPException(
            status_code=401, detail="아이디 혹은 비밀번호가 잘못됐습니다."
        )


@router.post("/logout")
def logout():
    return {"message": "로그아웃 성공"}
