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

@router.get("/")
async def list_projects(user: AuthedUser) -> List[Project]:
    """List all projects."""
    project = await storage.list_projects(user["user_id"])
    return project

@router.post("/")
async def create_project(user: AuthedUser, request: Request) -> Project:
    """Create a new project."""
    request = await request.json()
    project = await storage.create_project(user["user_id"], request["name"], request["description"])
    return project

@router.get("/{project_id}")  
async def get_project(user: AuthedUser, project_id: str) -> dict:
    """Get a project by ID."""
    project = await storage.get_project(user["user_id"], project_id)
    key = os.environ["JWT_DECODE_KEY_B64"]
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    jwt_token = jwt.encode(key = key, payload={"user_id": user["user_id"], "project_id": project_id, "alg":auth_settings.jwt_local.alg, "iss": auth_settings.jwt_local.iss, "aud": auth_settings.jwt_local.aud, "exp": datetime.now(timezone.utc) + timedelta(days=1),},)
    return {"jwt_token": jwt_token}

@router.delete("/{project_id}")
async def delete_project(user: AuthedUser, project_id: str) -> dict:
    """Delete a project by ID."""
    project = await storage.delete_project(user["user_id"], project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project