from fastapi import APIRouter, HTTPException, Path, Form, Request
import jwt
from datetime import datetime, timedelta, timezone
import os

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