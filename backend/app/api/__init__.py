from fastapi import APIRouter

from app.api.assistants import router as assistants_router
from app.api.runs import router as runs_router
from app.api.threads import router as threads_router
from app.api.authentication import router as authentication_router
from app.api.projects import router as projects_router
from app.api.user import router as users_router
from app.api.price import router as price_router
from app.api.checkout import router as checkout_router

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
    users_router,
    prefix="/user",
    tags=["user"],
)
router.include_router(
    price_router,
    prefix="/price",
    tags=["price"],
)
router.include_router(
    checkout_router,
    prefix="/checkout",
    tags=["checkout"],
)