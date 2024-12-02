from fastapi import APIRouter, HTTPException, Path, Form, Request
import jwt
from datetime import datetime, timedelta, timezone
import os
from app.auth.handlers import AuthedUser


from app.auth.settings import (
    settings as auth_settings,
)

import app.storage as storage


router = APIRouter()

@router.post("/login")
async def login(request: Request) -> dict:
    """Login with a user ID."""
    request = await request.json()
    user = await storage.get_user(request["email"], request["password"])
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    key = os.environ["JWT_DECODE_KEY_B64"]
    jwt_token = jwt.encode(key = key, payload={"user_id": user["user_id"], "alg": auth_settings.jwt_local.alg ,"iss": auth_settings.jwt_local.iss, "aud": auth_settings.jwt_local.aud, "exp": datetime.now(timezone.utc) + timedelta(days=30),},)
    return {"jwt_token": jwt_token}
    # return jwt.encode(payload={"sub": user["user_id"],            "iss": auth_settings.jwt_local.iss,
    #         "aud": auth_settings.jwt_local.aud,
    #         "exp": datetime.now(timezone.utc) + timedelta(days=1),}, key="secret")

@router.post("/signup", description="Create a new user.")
async def signup(email : str = Form(...), password: str = Form(...)) -> dict:
    """Create a new user."""
    user = await storage.create_user(email, password)
    if not user:
        raise HTTPException(status_code=400, detail="User already exists.")
    return user

@router.get("/thread-info")
async def thread_info(user: AuthedUser) -> dict:
    """Get information about a thread."""
    threads_info = await storage.get_thread_info(user["user_id"])
    return {"thread_counter": threads_info[0]["thread_counter"], "thread_max": threads_info[0]["max_thread_counter"]}