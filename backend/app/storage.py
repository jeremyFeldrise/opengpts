from datetime import datetime, timezone
from typing import Any, List, Optional, Sequence, Union

import bcrypt

from langchain_core.messages import AnyMessage
from langchain_core.runnables import RunnableConfig

from app.agent import agent
from app.lifespan import get_pg_pool
from app.schema import Assistant, Thread, User, ThreadInfo

import stripe

async def list_assistants(project_id: str) -> List[Assistant]:
    """List all assistants for the current user."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch("SELECT * FROM assistant WHERE project_id = $1", project_id)


async def get_assistant(project_id: str, assistant_id: str) -> Optional[Assistant]:
    """Get an assistant by ID."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetchrow(
            "SELECT * FROM assistant WHERE assistant_id = $1 AND (project_id = $2 OR public IS true)",
            assistant_id,
            project_id,
        )


async def list_public_assistants() -> List[Assistant]:
    """List all the public assistants."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch(("SELECT * FROM assistant WHERE public IS true;"))


async def put_assistant(
    project_id: str, assistant_id: str, *, name: str, config: dict, public: bool = False
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
                    "INSERT INTO assistant (assistant_id, project_id, name, config, updated_at, public) VALUES ($1, $2, $3, $4, $5, $6) "
                    "ON CONFLICT (assistant_id) DO UPDATE SET "
                    "project_id = EXCLUDED.project_id, "
                    "name = EXCLUDED.name, "
                    "config = EXCLUDED.config, "
                    "updated_at = EXCLUDED.updated_at, "
                    "public = EXCLUDED.public;"
                ),
                assistant_id,
                project_id,
                name,
                config,
                updated_at,
                public,
            )
    return {
        "assistant_id": assistant_id,
        "project_id": project_id,
        "name": name,
        "config": config,
        "updated_at": updated_at,
        "public": public,
    }


async def delete_assistant(project_id: str, assistant_id: str) -> None:
    """Delete an assistant by ID."""
    async with get_pg_pool().acquire() as conn:
        await conn.execute(
            "DELETE FROM assistant WHERE assistant_id = $1 AND project_id = $2",
            assistant_id,
            project_id,
        )

async def increment_thread_count(user_id: str, assistant_id: str) -> None:
    """Increment the thread count."""
    async with get_pg_pool().acquire() as conn:
        assistant = await conn.fetchrow(
            'SELECT * FROM assistant WHERE assistant_id = $1', assistant_id
        )
        print("assistant Type", assistant["config"]["configurable"]["type==agent/agent_type"])
        if assistant is not None:
            agent_token_price = await conn.fetchrow('SELECT * FROM assistant_token_price WHERE agent_type = $1', assistant["config"]["configurable"]["type==agent/agent_type"])
            print("agent_token_price", agent_token_price)
            if agent_token_price is None:
                agent_token_price = {"price": 1}
            await conn.execute(
            'UPDATE "user" SET thread_counter = thread_counter +  $1 WHERE user_id = $2',
            agent_token_price["price"],
            user_id,
        )

async def list_threads(project_id: str) -> List[Thread]:
    """List all threads for the current user."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch("SELECT * FROM thread WHERE project_id = $1", project_id)


async def get_thread(project_id: str, thread_id: str) -> Optional[Thread]:
    """Get a thread by ID."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetchrow(
            "SELECT * FROM thread WHERE thread_id = $1 AND project_id = $2",
            thread_id,
            project_id,
        )


async def get_thread_state(*, project_id: str, thread_id: str, assistant: Assistant):
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


async def get_thread_history(*, project_id: str, thread_id: str, assistant: Assistant):
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
    project_id: str, thread_id: str, *, assistant_id: str, name: str
) -> Thread:
    """Modify a thread."""
    updated_at = datetime.now(timezone.utc)
    assistant = await get_assistant(project_id, assistant_id)
    metadata = (
        {"assistant_type": assistant["config"]["configurable"]["type"]}
        if assistant
        else None
    )
    async with get_pg_pool().acquire() as conn:
        await conn.execute(
            (
                "INSERT INTO thread (thread_id, project_id, assistant_id, name, updated_at, metadata) VALUES ($1, $2, $3, $4, $5, $6) "
                "ON CONFLICT (thread_id) DO UPDATE SET "
                "project_id = EXCLUDED.project_id,"
                "assistant_id = EXCLUDED.assistant_id, "
                "name = EXCLUDED.name, "
                "updated_at = EXCLUDED.updated_at, "
                "metadata = EXCLUDED.metadata;"
            ),
            thread_id,
            project_id,
            assistant_id,
            name,
            updated_at,
            metadata,
        )
        return {
            "thread_id": thread_id,
            "project_id": project_id,
            "assistant_id": assistant_id,
            "name": name,
            "updated_at": updated_at,
            "metadata": metadata,
        }


async def delete_thread(project_id: str, thread_id: str):
    """Delete a thread by ID."""
    async with get_pg_pool().acquire() as conn:
        await conn.execute(
            "DELETE FROM thread WHERE thread_id = $1 AND project_id = $2",
            thread_id,
            project_id,
        )

async def get_projects(user_id: str) -> List[dict]:
    """Get all projects for a user."""
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch("SELECT * FROM project WHERE user_id = $1", user_id)

async def create_project(user_id: str, name: str, description: str) -> dict:
    """Create a new project."""
    async with get_pg_pool().acquire() as conn:
        project = await conn.execute(
            "INSERT INTO project (user_id, name, description) VALUES ($1, $2, $3)",
            user_id,
            name,
            description,
        )
        return {
            "project_id": "Test",
            "user_id": user_id,
            "name": name,
            "description": description,
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
            "DELETE FROM assistant WHERE project_id = $1",
            project_id,
        )
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

async def create_user(email: str, password: str, provider: str) -> User:
    """Create a new user."""

    password_encoded = ""
    if password is not None:
        bytes = password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(bytes, salt)
        password_encoded = hashed.decode("utf-8")
    stripe_client_id = stripe.Customer.create(email=email)

    async with get_pg_pool().acquire() as conn:
        user = await conn.fetchrow(
            'INSERT INTO "user" (email, password, stripe_client_id, provider) VALUES ($1, $2, $3, $4) RETURNING *', email, password_encoded, stripe_client_id["id"], provider
        )
        return user
    
async def get_user_by_email_and_provider(email: str, provider: str) -> User:
    async with get_pg_pool().acquire() as conn:
        return await conn.fetchrow('SELECT * FROM "user" WHERE email = $1 AND provider = $2', email, provider)

async def get_thread_info(user_id: str) -> ThreadInfo:
    async with get_pg_pool().acquire() as conn:
        return await conn.fetch('SELECT * FROM "user" WHERE user_id = $1', user_id)
    
async def get_agent_price(agent_name: str) -> dict:
    async with get_pg_pool().acquire() as conn:
        return await conn.fetchrow('SELECT * FROM assistant_token_price WHERE agent_type = $1', agent_name)
    
async def increment_user_token_counter(stripe_customer_id : str, token_quantity : int) -> None:
    async with get_pg_pool().acquire() as conn:
        await conn.execute(
            'UPDATE "user" SET max_thread_counter = max_thread_counter +  $1 WHERE stripe_client_id = $2',
            token_quantity,
            stripe_customer_id,
        )

async def update_user_stripe_id(user: User) -> User:
    async with get_pg_pool().acquire() as conn:
        stripe_client_id = stripe.Customer.create(email=user.email)

        return await conn.fetchrow(
            'UPDATE "user" SET stripe_client_id = $1 WHERE user_id = $2 RETURNING *', stripe_client_id, user["user_id"]
        )