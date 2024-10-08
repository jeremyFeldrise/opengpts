import app.storage as storage
from app.auth.handlers import AuthedUser
from app.schema import ChatbotConfiguration
from pydantic import BaseModel, Field

from fastapi import APIRouter, HTTPException, Path


router = APIRouter()


class ChatbotConfigurationPayload(BaseModel):
    """Payload for creating a chatbot configuration."""
    openai_api_key: str = Field(default="", description="The name of the chatbot configuration.")
    anthropic_api_key: str = Field(default="", description="The chatbot configuration.")
    ydc_api_key: str = Field(default="", description="Whether the chatbot configuration is public.")
    tavili_api_key: str = Field(default="", description="Whether the chatbot configuration is public.")

@router.get("/")
async def list_chatbot_configurations(user: AuthedUser) -> ChatbotConfiguration:
    """Get current chatbot configurations for the current user."""
    return await storage.get_chatbot_configuration(user["user_id"])

@router.post("/")
async def create_chatbot_configuration(
    user: AuthedUser,
    payload: ChatbotConfigurationPayload,
) -> ChatbotConfiguration:
    """Create a chatbot configuration."""
    print("Creating chatbot configuration")
    print(payload)
    response =  await storage.create_chatbot_configuration(
        user["user_id"],
        openai_api_key=payload.openai_api_key,
        anthropic_api_key=payload.anthropic_api_key,
        ydc_api_key=payload.ydc_api_key,
        tavili_api_key=payload.tavili_api_key,
    )
    print("Response", response)
    return response

@router.delete("/")
async def delete_chatbot_configuration(user: AuthedUser) -> ChatbotConfiguration:
    """Delete a chatbot configuration."""
    return await storage.delete_chatbot_configuration(user["user_id"])