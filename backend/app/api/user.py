import os
from fastapi import APIRouter, HTTPException, Path, Form, Request
from app.auth.handlers import AuthedUser
import app.storage as storage
from typing import Any, List, Optional, Sequence, Union
from app.schema import Assistant, Thread, User, Project


from app.auth.settings import (
    settings as auth_settings,
)

import jwt
from datetime import datetime, timedelta, timezone

router = APIRouter()

@router.get("/threads")
async def list_threads(user: AuthedUser) -> List[Thread]:
    """List all threads."""
    return {user["thread_counter"], user["thread_max"]}