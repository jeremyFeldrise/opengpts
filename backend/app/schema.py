from datetime import datetime
from typing import Optional

from typing_extensions import TypedDict


class User(TypedDict):
    user_id: str
    """The ID of the user."""
    email: str
    """The email of the user."""
    created_at: datetime
    """The time the user was created."""
    projects: list[str]
    """The projects the user has access to."""
    project_id: str
    """The ID of the project."""
    thread_counter: int
    """The number of threads the user has."""
    thread_max: int
    """The maximum number of threads the user can have."""

class Project(TypedDict):
    project_id: str
    """The ID of the project."""
    user_id: str
    """The ID of the user that owns the project."""
    name: str
    """The name of the project."""
    description: str
    """The description of the project."""


class Assistant(TypedDict):
    """Assistant model."""

    assistant_id: str
    """The ID of the assistant."""
    project_id: str
    """The ID of the user that owns the assistant."""
    name: str
    """The name of the assistant."""
    config: dict
    """The assistant config."""
    updated_at: datetime
    """The last time the assistant was updated."""
    public: bool
    """Whether the assistant is public."""


class Thread(TypedDict):
    thread_id: str
    """The ID of the thread."""
    project_id: str
    """The ID of the user that owns the thread."""
    assistant_id: Optional[str]
    """The assistant that was used in conjunction with this thread."""
    name: str
    """The name of the thread."""
    updated_at: datetime
    """The last time the thread was updated."""
    metadata: Optional[dict]

class ThreadInfo(TypedDict):
    thread_counter: int
    """The number of threads the user has."""
    thread_max_counter: int
    """The maximum number of threads the user can have."""