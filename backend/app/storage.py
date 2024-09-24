from datetime import datetime, timezone
from typing import Any, List, Optional, Sequence, Union

import bcrypt

from langchain_core.messages import AnyMessage
from langchain_core.runnables import RunnableConfig

from app.agent import agent
from app.lifespan import get_pg_pool
from app.schema import Assistant, Thread, User


async def list_assistants(user_id: str) -> List[Assistant]:
    """List all assistants for the current user."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch("SELECT * FROM assistant WHERE user_id = $1", user_id)


async def get_assistant(user_id: str, assistant_id: str) -> Optional[Assistant]:
    """Get an assistant by ID."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetchrow(
            "SELECT * FROM assistant WHERE assistant_id = $1 AND (user_id = $2 OR public IS true)",
            assistant_id,
            user_id,
        )


async def list_public_assistants() -> List[Assistant]:
    """List all the public assistants."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch(("SELECT * FROM assistant WHERE public IS true;"))


async def put_assistant(
    user_id: str, assistant_id: str, *, name: str, config: dict, public: bool = False
) -> Assistant:
    """Modify an assistant.

    Args:
        user_id: The user ID.
        assistant_id: The assistant ID.
        name: The assistant name.
        config: The assistant config.
        public: Whether the assistant is public.

    Returns:
        return the assistant model if no exception is raised.
    """
    updated_at = datetime.now(timezone.utc)
    async with get_pg_pool().acquire() as conn:
        async with conn.transaction():
            await conn.execute(
                (
                    "INSERT INTO assistant (assistant_id, user_id, name, config, updated_at, public) VALUES ($1, $2, $3, $4, $5, $6) "
                    "ON CONFLICT (assistant_id) DO UPDATE SET "
                    "user_id = EXCLUDED.user_id, "
                    "name = EXCLUDED.name, "
                    "config = EXCLUDED.config, "
                    "updated_at = EXCLUDED.updated_at, "
                    "public = EXCLUDED.public;"
                ),
                assistant_id,
                user_id,
                name,
                config,
                updated_at,
                public,
            )
    return {
        "assistant_id": assistant_id,
        "user_id": user_id,
        "name": name,
        "config": config,
        "updated_at": updated_at,
        "public": public,
    }


async def delete_assistant(user_id: str, assistant_id: str) -> None:
    """Delete an assistant by ID."""
    async with get_pg_pool().acquire() as conn:
        await conn.execute(
            "DELETE FROM assistant WHERE assistant_id = $1 AND user_id = $2",
            assistant_id,
            user_id,
        )


async def list_threads(user_id: str) -> List[Thread]:
    """List all threads for the current user."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch("SELECT * FROM thread WHERE user_id = $1", user_id)


async def get_thread(user_id: str, thread_id: str) -> Optional[Thread]:
    """Get a thread by ID."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetchrow(
            "SELECT * FROM thread WHERE thread_id = $1 AND user_id = $2",
            thread_id,
            user_id,
        )


async def get_thread_state(*, user_id: str, thread_id: str, assistant: Assistant):
    """Get state for a thread."""
    state = await agent.aget_state(
        {
            "configurable": {
                **assistant["config"]["configurable"],
                "thread_id": thread_id,
                "assistant_id": assistant["assistant_id"],
            }
        }
    )
    return {
        "values": state.values,
        "next": state.next,
    }


async def update_thread_state(
    config: RunnableConfig,
    values: Union[Sequence[AnyMessage], dict[str, Any]],
    *,
    user_id: str,
    assistant: Assistant,
):
    """Add state to a thread."""
    await agent.aupdate_state(
        {
            "configurable": {
                **assistant["config"]["configurable"],
                **config["configurable"],
                "assistant_id": assistant["assistant_id"],
            }
        },
        values,
    )


async def get_thread_history(*, user_id: str, thread_id: str, assistant: Assistant):
    """Get the history of a thread."""
    return [
        {
            "values": c.values,
            "next": c.next,
            "config": c.config,
            "parent": c.parent_config,
        }
        async for c in agent.aget_state_history(
            {
                "configurable": {
                    **assistant["config"]["configurable"],
                    "thread_id": thread_id,
                    "assistant_id": assistant["assistant_id"],
                }
            }
        )
    ]


async def put_thread(
    user_id: str, thread_id: str, *, assistant_id: str, name: str
) -> Thread:
    """Modify a thread."""
    updated_at = datetime.now(timezone.utc)
    assistant = await get_assistant(user_id, assistant_id)
    metadata = (
        {"assistant_type": assistant["config"]["configurable"]["type"]}
        if assistant
        else None
    )
    async with get_pg_pool().acquire() as conn:
        await conn.execute(
            (
                "INSERT INTO thread (thread_id, user_id, assistant_id, name, updated_at, metadata) VALUES ($1, $2, $3, $4, $5, $6) "
                "ON CONFLICT (thread_id) DO UPDATE SET "
                "user_id = EXCLUDED.user_id,"
                "assistant_id = EXCLUDED.assistant_id, "
                "name = EXCLUDED.name, "
                "updated_at = EXCLUDED.updated_at, "
                "metadata = EXCLUDED.metadata;"
            ),
            thread_id,
            user_id,
            assistant_id,
            name,
            updated_at,
            metadata,
        )
        return {
            "thread_id": thread_id,
            "user_id": user_id,
            "assistant_id": assistant_id,
            "name": name,
            "updated_at": updated_at,
            "metadata": metadata,
        }


async def delete_thread(user_id: str, thread_id: str):
    """Delete a thread by ID."""
    async with get_pg_pool().acquire() as conn:
        await conn.execute(
            "DELETE FROM thread WHERE thread_id = $1 AND user_id = $2",
            thread_id,
            user_id,
        )

async def get_projects(user_id: str) -> List[dict]:
    """Get all projects for a user."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch("SELECT * FROM project WHERE user_id = $1", user_id)

async def create_project(user_id: str, name: str) -> dict:
    """Create a new project."""
    async with get_pg_pool().acquire() as conn:
        project = await conn.execute(
            "INSERT INTO project (user_id, name) VALUES ($1, $2)",
            user_id,
            name,
        )

        return {
            "project_id": "Test",
            "user_id": user_id,
            "name": name,
        }

async def list_projects(user_id: str) -> List[dict]:
    """List all projects for the current user."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch("SELECT * FROM project WHERE user_id = $1", user_id)

async def get_project(user_id: str, project_id: str) -> Optional[dict]:
    """Get a project by ID."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetchrow(
            "SELECT * FROM project WHERE project_id = $1 AND user_id = $2",
            project_id,
            user_id,
        )

async def delete_project(user_id: str, project_id: str) -> None:
    """Delete a project by ID."""
    async with get_pg_pool().acquire() as conn:
        await conn.execute(
            "DELETE FROM project WHERE project_id = $1 AND user_id = $2",
            project_id,
            user_id,
        )   

async def get_user(email: str, password: str) -> User:
    """Returns the user."""
    async with get_pg_pool().acquire() as conn:
        user = await conn.fetchrow('SELECT * FROM "user" WHERE email = $1', email)
        if user is not None:
            if bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
                return dict(user)

        return None
async def get_user_by_id(user_id: str) -> User:
    """Returns the user."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetchrow('SELECT * FROM "user" WHERE user_id = $1', user_id)

async def create_user(email: str, password: str) -> User:
    """Create a new user."""
    bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(bytes, salt)

    async with get_pg_pool().acquire() as conn:
        user = await conn.fetchrow(
            'INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING *', email, hashed.decode("utf-8")
        )
        return user
    
