from fastapi import APIRouter, HTTPException, Path, Form, Request
from fastapi.responses import RedirectResponse
import jwt
from datetime import datetime, timedelta, timezone
import os
from fastapi_sso.sso.google import GoogleSSO

from app.auth.settings import (
    settings as auth_settings,
)

import app.storage as storage


router = APIRouter()

google_sso = GoogleSSO(os.environ["GOOGLE_OAUTH_CLIENT_ID"], os.environ["GOOGLE_OAUTH_SECRET_ID"], "http://localhost:8100/auth/google/callback")

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
    user = await storage.create_user(email, password, "Epsimo")
    if not user:
        raise HTTPException(status_code=400, detail="User already exists.")
    return user

@router.get("/google/login")
async def google_login():
    async with google_sso:
        response = await google_sso.get_login_redirect()
        return response.headers["location"]

@router.get("/google/callback")
async def google_callback(request: Request):
    print("request var",vars(request))
    async with google_sso:
        user = await google_sso.verify_and_process(request)
        print("User", user.email)
        db_user = await storage.get_user_by_email_and_provider(user.email, "google")
        if db_user is None:
            db_user = await storage.create_user(user.email, None, "google")
            key = os.environ["JWT_DECODE_KEY_B64"]
            jwt_token = jwt.encode(key = key, payload={"user_id": db_user["user_id"], "alg": auth_settings.jwt_local.alg ,"iss": auth_settings.jwt_local.iss, "aud": auth_settings.jwt_local.aud, "exp": datetime.now(timezone.utc) + timedelta(days=30),},)
            return RedirectResponse(url=f"http://localhost:5173/auth-callback?jwt_token={jwt_token}")
        key = os.environ["JWT_DECODE_KEY_B64"]
        jwt_token = jwt.encode(key = key, payload={"user_id": db_user["user_id"], "alg": auth_settings.jwt_local.alg ,"iss": auth_settings.jwt_local.iss, "aud": auth_settings.jwt_local.aud, "exp": datetime.now(timezone.utc) + timedelta(days=30),},)
        return RedirectResponse(url=f"http://localhost:5173/auth-callback?jwt_token={jwt_token}")