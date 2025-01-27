import os
from functools import lru_cache
from urllib.parse import urlparse

import boto3
import httpx
import structlog
from langchain_anthropic import ChatAnthropic
from langchain_community.chat_models import BedrockChat, ChatFireworks
from langchain_community.chat_models.ollama import ChatOllama
from langchain_google_vertexai import ChatVertexAI
from langchain_openai import AzureChatOpenAI, ChatOpenAI
from langchain_groq import ChatGroq
from langchain_openai.chat_models.base import BaseChatOpenAI


logger = structlog.get_logger(__name__)


@lru_cache(maxsize=4)
def get_openai_llm(model: str = "gpt-4o", azure: bool = False):
    proxy_url = os.getenv("PROXY_URL")
    http_client = None
    if proxy_url:
        parsed_url = urlparse(proxy_url)
        if parsed_url.scheme and parsed_url.netloc:
            http_client = httpx.AsyncClient(proxies=proxy_url)
        else:
            logger.warn("Invalid proxy URL provided. Proceeding without proxy.")

    if not azure:
        try:
            openai_model = model
            llm = ChatOpenAI(
                http_client=http_client,
                model=openai_model,
                temperature=0,
                
            )
        except Exception as e:
            logger.error(
                f"Failed to instantiate ChatOpenAI due to: {str(e)}. Falling back to AzureChatOpenAI."
            )
            llm = AzureChatOpenAI(
                http_client=http_client,
                temperature=0,
                deployment_name=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
                azure_endpoint=os.environ["AZURE_OPENAI_API_BASE"],
                openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
                openai_api_key=os.environ["AZURE_OPENAI_API_KEY"],
            )
    else:
        llm = AzureChatOpenAI(
            http_client=http_client,
            temperature=0,
            deployment_name=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
            azure_endpoint=os.environ["AZURE_OPENAI_API_BASE"],
            openai_api_version=os.environ["AZURE_OPENAI_API_VERSION"],
            openai_api_key=os.environ["AZURE_OPENAI_API_KEY"],
        )
    return llm



@lru_cache(maxsize=2)
def get_anthropic_llm(bedrock: bool = False):
    if bedrock:
        client = boto3.client(
            "bedrock-runtime",
            region_name="us-west-2",
            aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
        )
        model = BedrockChat(model_id="anthropic.claude-v2", client=client)
    else:
        model = ChatAnthropic(
            model_name="claude-3-5-sonnet-20241022",
            max_tokens_to_sample=2000,
            temperature=0,
        )
    return model

@lru_cache(maxsize=1)
def get_claude_35_sonnet_llm():
    return ChatAnthropic(
        model_name="claude-3-5-sonnet-latest",
        max_tokens_to_sample=2000,
        temperature=0,
    )

@lru_cache(maxsize=1)
def get_claude_3_opus_llm():
    return ChatAnthropic(
        model_name="claude-3-opus-latest",
        max_tokens_to_sample=2000,
        temperature=0,
    )
@lru_cache(maxsize=1)
def get_claude_3_5_haiku_llm():
    return ChatAnthropic(
        model_name="claude-3-5-haiku-latest",
        max_tokens_to_sample=2000,
        temperature=0,
    )

@lru_cache(maxsize=1)
def get_google_llm():
    return ChatVertexAI(
        model_name="gemini-1.5-flash", convert_system_message_to_human=True, streaming=True
    )


@lru_cache(maxsize=1)
def get_mixtral_fireworks():
    return ChatFireworks(model="accounts/fireworks/models/mixtral-8x7b-instruct")


@lru_cache(maxsize=1)
def get_ollama_llm():
    model_name = os.environ.get("OLLAMA_MODEL")
    if not model_name:
        model_name = "llama2"
    ollama_base_url = os.environ.get("OLLAMA_BASE_URL")
    if not ollama_base_url:
        ollama_base_url = "http://localhost:11434"

    return ChatOllama(model=model_name, base_url=ollama_base_url)

@lru_cache(maxsize=1)
def get_groq70B_llm():
    return ChatGroq(temperature=0, groq_api_key=os.environ.get("GROQ_API_KEY"), model_name="llama3-70b-8192")

@lru_cache(maxsize=1)
def get_groq8B_llm():
    return ChatGroq(temperature=0, groq_api_key=os.environ.get("GROQ_API_KEY"), model_name="llama3-8b-8192")

@lru_cache(maxsize=1)
def get_groq_llama_70B_versatile_llm():
    return ChatGroq(temperature=0, groq_api_key=os.environ.get("GROQ_API_KEY"), model_name="llama-3.3-70b-versatile")

@lru_cache(maxsize=1)
def get_groq_llama_90B_llm():
    return ChatGroq(temperature=0, groq_api_key=os.environ.get("GROQ_API_KEY"), model_name="llama-3.-90b-text-preview")

@lru_cache(maxsize=1)
def get_groq_whisper_llm():
    return ChatGroq(temperature=0, groq_api_key=os.environ.get("GROQ_API_KEY"), model_name="whisper-large-v3")

@lru_cache(maxsize=1)
def get_groq_deepseek_llm():
    return ChatGroq(temperature=0, groq_api_key=os.environ.get("GROQ_API_KEY"), model_name="deepseek-r1-distill-llama-70b")

@lru_cache(maxsize=1)
def get_deepseek_llm():
    return BaseChatOpenAI(
    model='deepseek-chat', 
    openai_api_key=os.environ.get("DEEPSEEK_API_KEY"), 
    openai_api_base='https://api.deepseek.com/',
    max_tokens=1024
)

@lru_cache(maxsize=1)
def get_deepseek_reasoner_llm():
    return BaseChatOpenAI(
    model='deepseek-reasoner', 
    openai_api_key=os.environ.get("DEEPSEEK_API_KEY"), 
    openai_api_base='https://api.deepseek.com/',
    max_tokens=1024
)