from fastapi import APIRouter, HTTPException, Path, Form
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

from app.auth.settings import (
    settings as auth_settings,
)

import app.storage as storage


router = APIRouter()

@router.post("/login", description="Login with a user ID.")
async def login(email: str, password: str) -> dict:
    """Login with a user ID."""
    print("login")
    user = await storage.get_user(email, password)
    print(user)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    jwt_token = jwt.encode(key = "key", payload={"user_id": user["user_id"], "iss": auth_settings.jwt_local.iss, "aud": auth_settings.jwt_local.aud, "exp": datetime.now(timezone.utc) + timedelta(days=1),},)
    return {"jwt_token": jwt_token}
    # return jwt.encode(payload={"sub": user["user_id"],            "iss": auth_settings.jwt_local.iss,
    #         "aud": auth_settings.jwt_local.aud,
    #         "exp": datetime.now(timezone.utc) + timedelta(days=1),}, key="secret")

@router.post("/signup", description="Create a new user.")
async def signup(email : str = Form(...), password: str = Form(...)) -> dict:
    """Create a new user."""
    print("signup")
    user = await storage.create_user(email, password)
    if not user:
        raise HTTPException(status_code=400, detail="User already exists.")
    return user