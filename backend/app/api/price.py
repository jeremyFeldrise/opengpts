from fastapi import APIRouter, HTTPException, Path, Form, Request
import jwt
from datetime import datetime, timedelta, timezone
import os
from app.auth.handlers import AuthedUser

import app.storage as storage

router = APIRouter()

@router.get("/agent-price")
async def get_agent_price(user: AuthedUser, agent_name:str) -> dict:
    """Get the price of a thread."""
    print("agent_name", agent_name)
    threads_info = await storage.get_agent_price(agent_name)
    print("threads_info", threads_info)
    return {"price": threads_info["price"]}