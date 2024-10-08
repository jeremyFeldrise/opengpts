from fastapi import APIRouter

from app.api.assistants import router as assistants_router
from app.api.runs import router as runs_router
from app.api.threads import router as threads_router
from app.api.authentication import router as authentication_router
from app.api.projects import router as projects_router
from app.api.chatbot_configuration import router as chatbot_configuration_router

router = APIRouter()


@router.get("/ok")
async def ok():
    return {"ok": True}

router.include_router(
    authentication_router,
    prefix="/auth",
    tags=["auth"],
)
router.include_router(
    projects_router,
    prefix="/projects",
    tags=["projects"],
)
router.include_router(
    assistants_router,
    prefix="/assistants",
    tags=["assistants"],
)
router.include_router(
    runs_router,
    prefix="/runs",
    tags=["runs"],
)
router.include_router(
    threads_router,
    prefix="/threads",
    tags=["threads"],
)
router.include_router(
    chatbot_configuration_router,
    prefix="/chatbot_configuration",
    tags=["chatbot_configuration"],
)