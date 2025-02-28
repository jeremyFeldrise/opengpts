import pickle
from enum import Enum
from typing import Any, Dict, Mapping, Optional, Sequence, Union

from langchain_core.messages import AnyMessage
from langchain_core.runnables import (
    ConfigurableField,
    RunnableBinding,
)
from langgraph.checkpoint import CheckpointAt
from langgraph.graph.message import Messages
from langgraph.pregel import Pregel

from app.agent_types.tools_agent import get_tools_agent_executor
from app.agent_types.xml_agent import get_xml_agent_executor
from app.chatbot import get_chatbot_executor
from app.checkpoint import PostgresCheckpoint
from app.llms import (
    get_anthropic_llm,
    get_google_llm,
    get_mixtral_fireworks,
    get_ollama_llm,
    get_openai_llm,
    get_groq70B_llm,
    get_groq8B_llm,
    get_claude_35_sonnet_llm,
    get_claude_3_opus_llm,
    get_claude_3_5_haiku_llm,
    get_groq_llama_70B_versatile_llm,
    get_groq_llama_90B_llm,
    get_groq_whisper_llm,
    get_groq_deepseek_llm,
    get_deepseek_llm,
    get_deepseek_reasoner_llm,
    get_grok_llm
)
from app.retrieval import get_retrieval_executor
from app.tools import (
    RETRIEVAL_DESCRIPTION,
    TOOLS,
    ActionServer,
    Arxiv,
    AvailableTools,
    Connery,
    DallE,
    DDGSearch,
    PressReleases,
    PubMed,
    Retrieval,
    SecFilings,
    Tavily,
    TavilyAnswer,
    Wikipedia,
    YouSearch,
    get_retrieval_tool,
    get_retriever,
)

Tool = Union[
    ActionServer,
    Connery,
    DDGSearch,
    Arxiv,
    YouSearch,
    SecFilings,
    PressReleases,
    PubMed,
    Wikipedia,
    Tavily,
    TavilyAnswer,
    Retrieval,
    DallE,
]


class AgentType(str, Enum):
    # GPT_35_TURBO = "GPT 3.5 Turbo"
    GPT_4O = "GPT 4o"
    GPT_4O_mini = "GPT 4o Mini"
    # GPT_O1 = "GPT o1"
    # GPT_O1_mini = "GPT o1 Mini"
    # GPT_4O1_mini = "GPT 4o1 Mini"
    # AZURE_OPENAI = "GPT 4 (Azure OpenAI)"
    CLAUDE35_HAIKU = "Claude 3.5 (Haiku)"
    CLAUDE35_SONNET = "Claude 3.7 (Sonnet)"
    CLAUDE3_OPUS = "Claude 3 (Opus)"
    # BEDROCK_CLAUDE2 = "Claude 2 (Amazon Bedrock)"
    MIXTRAL = "Mixtral"
    GEMINI = "GEMINI"
    OLLAMA = "Ollama"
    GROQ70B = "GROQ (llama3-70b-8192)"
    GROQ70B_VERSATILE = "GROQ (llama3.3-70b-versatile) Versatile"
    GROQDEEPSEEK="GROQ (deepseek-r1-distill-llama-70b)"
    # GROQ90B = "GROQ (llama3.2-90b-text-preview) Text Preview"
    # GROQ_WHISPER = "GROQ Whisper Large v3"
    GROQ8B = "GROQ (llama3-8b-8192)"
    DEEPSEEK = "DeepSeek"
    DEEPSEEK_REASONER = "DeepSeek Reasoner"
    GROK2 = "GROK 2"

DEFAULT_SYSTEM_MESSAGE = "You are a helpful assistant."

CHECKPOINTER = PostgresCheckpoint(serde=pickle, at=CheckpointAt.END_OF_STEP)


def get_agent_executor(
    tools: list,
    agent: AgentType,
    system_message: str,
    interrupt_before_action: bool,
):
    # if agent == AgentType.GPT_35_TURBO:
    #     llm = get_openai_llm()
    #     return get_tools_agent_executor(
    #         tools, llm, system_message, interrupt_before_action, CHECKPOINTER
    #     )
    if agent == AgentType.GPT_4O:
        llm = get_openai_llm(model="gpt-4o")
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.GPT_4O_mini:
        llm = get_openai_llm(model="gpt-4o-mini")
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    # elif agent == AgentType.GPT_O1:
    #     llm = get_openai_llm(model="o1-preview")
    #     return get_tools_agent_executor(
    #         tools, llm, system_message, interrupt_before_action, CHECKPOINTER
    #     )
    # elif agent == AgentType.GPT_O1_mini:
    #     llm = get_openai_llm(model="o1-mini")
    #     return get_tools_agent_executor(
    #         tools, llm, system_message, interrupt_before_action, CHECKPOINTER
    #     )
    # elif agent == AgentType.AZURE_OPENAI:
    #     llm = get_openai_llm(azure=True)
    #     return get_tools_agent_executor(
    #         tools, llm, system_message, interrupt_before_action, CHECKPOINTER
    #     )
    elif agent == AgentType.CLAUDE35_HAIKU:
        llm = get_claude_3_5_haiku_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.CLAUDE35_SONNET:
        llm = get_claude_35_sonnet_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.CLAUDE3_OPUS:
        llm = get_claude_3_opus_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    # elif agent == AgentType.BEDROCK_CLAUDE2:
    #     llm = get_anthropic_llm(bedrock=True)
    #     return get_xml_agent_executor(
    #         tools, llm, system_message, interrupt_before_action, CHECKPOINTER
    #     )
    elif agent == AgentType.GROQ70B_VERSATILE:
        llm = get_groq_llama_70B_versatile_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    # elif agent == AgentType.GROQ90B:
    #     llm = get_groq_llama_90B_llm()
    #     return get_tools_agent_executor(
    #         tools, llm, system_message, interrupt_before_action, CHECKPOINTER
    #     )
    # elif agent == AgentType.GROQ_WHISPER:
    #     llm = get_groq_whisper_llm()
    #     return get_tools_agent_executor(
    #         tools, llm, system_message, interrupt_before_action, CHECKPOINTER)
    elif agent == AgentType.MIXTRAL:
        llm = get_mixtral_fireworks()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.GEMINI:
        llm = get_google_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.OLLAMA:
        llm = get_ollama_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.GROQ70B:
        llm = get_groq70B_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.GROQDEEPSEEK:
        llm = get_groq_deepseek_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.GROQ8B:
        llm = get_groq8B_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.DEEPSEEK:
        llm = get_deepseek_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.DEEPSEEK_REASONER:
        llm = get_deepseek_reasoner_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER
        )
    elif agent == AgentType.GROK2:
        llm = get_grok_llm()
        return get_tools_agent_executor(
            tools, llm, system_message, interrupt_before_action, CHECKPOINTER)
    else:
        raise ValueError("Unexpected agent type")


class ConfigurableAgent(RunnableBinding):
    tools: Sequence[Tool]
    agent: AgentType
    system_message: str = DEFAULT_SYSTEM_MESSAGE
    retrieval_description: str = RETRIEVAL_DESCRIPTION
    interrupt_before_action: bool = False
    assistant_id: Optional[str] = None
    thread_id: Optional[str] = None
    user_id: Optional[str] = None

    def __init__(
        self,
        *,
        tools: Sequence[Tool],
        agent: AgentType = AgentType.GPT_4O,
        system_message: str = DEFAULT_SYSTEM_MESSAGE,
        assistant_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        retrieval_description: str = RETRIEVAL_DESCRIPTION,
        interrupt_before_action: bool = False,
        kwargs: Optional[Mapping[str, Any]] = None,
        config: Optional[Mapping[str, Any]] = None,
        **others: Any,
    ) -> None:
        others.pop("bound", None)
        _tools = []
        for _tool in tools:
            if _tool["type"] == AvailableTools.RETRIEVAL:
                if assistant_id is None or thread_id is None:
                    raise ValueError(
                        "Both assistant_id and thread_id must be provided if Retrieval tool is used"
                    )
                _tools.append(
                    get_retrieval_tool(assistant_id, thread_id, retrieval_description)
                )
            else:
                tool_config = _tool.get("config", {})
                _returned_tools = TOOLS[_tool["type"]](**tool_config)
                if isinstance(_returned_tools, list):
                    _tools.extend(_returned_tools)
                else:
                    _tools.append(_returned_tools)
        _agent = get_agent_executor(
            _tools, agent, system_message, interrupt_before_action
        )
        agent_executor = _agent.with_config({"recursion_limit": 50})
        super().__init__(
            tools=tools,
            agent=agent,
            system_message=system_message,
            retrieval_description=retrieval_description,
            bound=agent_executor,
            kwargs=kwargs or {},
            config=config or {},
        )


class LLMType(str, Enum):
# GPT_35_TURBO = "GPT 3.5 Turbo"
    GPT_4O = "GPT 4o"
    GPT_4O_mini = "GPT 4o mini"
    # GPT_O1_mini = "GPT o1 Mini"
    # GPT_O1 = "GPT o1"
    # GPT_4O1_mini = "GPT 4o Mini"
    # AZURE_OPENAI = "GPT 4 (Azure OpenAI)"
    CLAUDE35_HAIKU = "Claude 3.5 (Haiku)"
    CLAUDE35_SONNET = "Claude 3.7 (Sonnet)"
    CLAUDE3_OPUS = "Claude 3 (Opus)"
    # BEDROCK_CLAUDE2 = "Claude 2 (Amazon Bedrock)"
    MIXTRAL = "Mixtral"
    GEMINI = "GEMINI"
    OLLAMA = "Ollama"
    GROQ70B = "GROQ (llama3-70b-8192)"
    GROQ70B_VERSATILE = "GROQ (llama3.3-70b-8192) Versatile"
    GROQ90B= "GROQ (llama3.2-90b-text-preview) Text Preview"
    GROQDEEPSEEK="GROQ (deepseek-r1-distill-llama-70b)"
    # GROQ_WHISPER = "GROQ Whisper Large v3"
    GROQ8B = "GROQ (llama3-8b-8192)"
    DEEPSEEK = "DeepSeek"
    DEEPSEEK_REASONER = "DeepSeek Reasoner"
    GROK2= "GROK 2"

def get_chatbot(
    llm_type: LLMType,
    system_message: str,
):
    # if llm_type == LLMType.GPT_35_TURBO:
    #     llm = get_openai_llm()
    if llm_type == LLMType.GPT_4O:
        llm = get_openai_llm()
    elif llm_type == LLMType.GPT_4O_mini:
        llm = get_openai_llm({"model": "gpt-4o-mini"})
    # elif llm_type == LLMType.GPT_O1:
    #     llm = get_openai_llm({"model": "o1-preview"})
    # elif llm_type == LLMType.GPT_O1_mini:
    #     llm = get_openai_llm({"model": "o1-mini"})
    # elif llm_type == LLMType.GPT_4O_mini:
    #     llm = get_openai_llm({"model": "gpt-4o-mini"})
    # elif llm_type == LLMType.AZURE_OPENAI:
    #     llm = get_openai_llm(azure=True)
    elif llm_type == LLMType.CLAUDE35_HAIKU:
        llm = get_claude_3_5_haiku_llm()
    elif llm_type == LLMType.CLAUDE35_SONNET:
        llm = get_claude_35_sonnet_llm()
    elif llm_type == LLMType.CLAUDE3_OPUS:
        llm = get_claude_3_opus_llm()
    # elif llm_type == LLMType.BEDROCK_CLAUDE2:
    #     llm = get_anthropic_llm(bedrock=True)
    elif llm_type == LLMType.GEMINI:
        llm = get_google_llm()
    elif llm_type == LLMType.MIXTRAL:
        llm = get_mixtral_fireworks()
    elif llm_type == LLMType.OLLAMA:
        llm = get_ollama_llm()
    elif llm_type == LLMType.GROQ70B:
        llm = get_groq70B_llm()
    elif llm_type == LLMType.GROQ8B:
        llm= get_groq8B_llm()
    elif llm_type == LLMType.GROQDEEPSEEK:
        llm = get_groq_deepseek_llm()
    elif llm_type == LLMType.GROQ70B_VERSATILE:
        llm = get_groq_llama_70B_versatile_llm()
    # elif llm_type == LLMType.GROQ90B:
    #     llm = get_groq_llama_90B_llm()
    # elif llm_type == LLMType.GROQ_WHISPER:
    #     llm = get_groq_whisper_llm()
    elif llm_type == LLMType.DEEPSEEK:
        llm = get_deepseek_llm()
    elif llm_type == LLMType.DEEPSEEK_REASONER:
        llm = get_deepseek_reasoner_llm()
    else:
        raise ValueError("Unexpected llm type")
    return get_chatbot_executor(llm, system_message, CHECKPOINTER)


class ConfigurableChatBot(RunnableBinding):
    llm: LLMType
    system_message: str = DEFAULT_SYSTEM_MESSAGE
    user_id: Optional[str] = None

    def __init__(
        self,
        *,
        llm: LLMType = LLMType.GPT_4O,
        system_message: str = DEFAULT_SYSTEM_MESSAGE,
        kwargs: Optional[Mapping[str, Any]] = None,
        config: Optional[Mapping[str, Any]] = None,
        **others: Any,
    ) -> None:
        others.pop("bound", None)

        chatbot = get_chatbot(llm, system_message)
        super().__init__(
            llm=llm,
            system_message=system_message,
            bound=chatbot,
            kwargs=kwargs or {},
            config=config or {},
        )


chatbot = (
    ConfigurableChatBot(llm=LLMType.GPT_4O, checkpoint=CHECKPOINTER)
    .configurable_fields(
        llm=ConfigurableField(id="llm_type", name="LLM Type"),
        system_message=ConfigurableField(id="system_message", name="Instructions"),
    )
    .with_types(
        input_type=Messages,
        output_type=Sequence[AnyMessage],
    )
)


class ConfigurableRetrieval(RunnableBinding):
    llm_type: LLMType
    system_message: str = DEFAULT_SYSTEM_MESSAGE
    assistant_id: Optional[str] = None
    thread_id: Optional[str] = None
    user_id: Optional[str] = None

    def __init__(
        self,
        *,
        llm_type: LLMType = LLMType.GPT_4O,
        system_message: str = DEFAULT_SYSTEM_MESSAGE,
        assistant_id: Optional[str] = None,
        thread_id: Optional[str] = None,
        kwargs: Optional[Mapping[str, Any]] = None,
        config: Optional[Mapping[str, Any]] = None,
        **others: Any,
    ) -> None:
        others.pop("bound", None)
        retriever = get_retriever(assistant_id, thread_id)
        # if llm_type == LLMType.GPT_35_TURBO:
        #     llm = get_openai_llm()
        if llm_type == LLMType.GPT_4O:
            llm = get_openai_llm(model="gpt-4o")
        elif llm_type == LLMType.GPT_4O_mini:
            llm = get_openai_llm(model="gpt-4o-mini")
        # elif llm_type == LLMType.GPT_O1:
        #     llm = get_openai_llm(model="o1-preview")
        # elif llm_type == LLMType.GPT_O1_mini:
        #     llm = get_openai_llm(model="o1-mini")
        # elif llm_type == LLMType.AZURE_OPENAI:
        #     llm = get_openai_llm(azure=True)
        elif llm_type == LLMType.GEMINI:
            llm = get_google_llm()
        elif llm_type == LLMType.MIXTRAL:
            llm = get_mixtral_fireworks()
        elif llm_type == LLMType.OLLAMA:
            llm = get_ollama_llm()
        elif llm_type == LLMType.GROQ70B:
            llm = get_groq70B_llm()
        elif llm_type == LLMType.GROQ8B:
            llm = get_groq8B_llm()
        elif llm_type == LLMType.GROQ70B_VERSATILE:
            llm = get_groq_llama_70B_versatile_llm()
        # elif llm_type == LLMType.GROQ90B:
        #     llm = get_groq_llama_90B_llm()
        # elif llm_type == LLMType.GROQ_WHISPER:
        #     llm = get_groq_whisper_llm()
        elif llm_type == LLMType.CLAUDE35_HAIKU:
            llm = get_claude_3_5_haiku_llm()
        elif llm_type == LLMType.CLAUDE35_SONNET:
            llm = get_claude_35_sonnet_llm()
        elif llm_type == LLMType.CLAUDE3_OPUS:
            llm = get_claude_3_opus_llm()
        elif llm_type == LLMType.DEEPSEEK:
            llm = get_deepseek_llm()
        elif llm_type == LLMType.DEEPSEEK_REASONER:
            llm = get_deepseek_reasoner_llm()
        elif llm_type == LLMType.GROK2:
            llm = get_grok_llm()
        else:
            raise ValueError("Unexpected llm type")
        chatbot = get_retrieval_executor(llm, retriever, system_message, CHECKPOINTER)
        super().__init__(
            llm_type=llm_type,
            system_message=system_message,
            bound=chatbot,
            kwargs=kwargs or {},
            config=config or {},
        )


chat_retrieval = (
    ConfigurableRetrieval(llm_type=LLMType.GPT_4O, checkpoint=CHECKPOINTER)
    .configurable_fields(
        llm_type=ConfigurableField(id="llm_type", name="LLM Type"),
        system_message=ConfigurableField(id="system_message", name="Instructions"),
        assistant_id=ConfigurableField(
            id="assistant_id", name="Assistant ID", is_shared=True
        ),
        thread_id=ConfigurableField(id="thread_id", name="Thread ID", is_shared=True),
    )
    .with_types(
        input_type=Dict[str, Any],
        output_type=Dict[str, Any],
    )
)


agent: Pregel = (
    ConfigurableAgent(
        agent=AgentType.GPT_4O,
        tools=[],
        system_message=DEFAULT_SYSTEM_MESSAGE,
        retrieval_description=RETRIEVAL_DESCRIPTION,
        assistant_id=None,
        thread_id=None,
    )
    .configurable_fields(
        agent=ConfigurableField(id="agent_type", name="Agent Type"),
        system_message=ConfigurableField(id="system_message", name="Instructions"),
        interrupt_before_action=ConfigurableField(
            id="interrupt_before_action",
            name="Tool Confirmation",
            description="If Yes, you'll be prompted to continue before each tool is executed.\nIf No, tools will be executed automatically by the agent.",
        ),
        assistant_id=ConfigurableField(
            id="assistant_id", name="Assistant ID", is_shared=True
        ),
        thread_id=ConfigurableField(id="thread_id", name="Thread ID", is_shared=True),
        tools=ConfigurableField(id="tools", name="Tools"),
        retrieval_description=ConfigurableField(
            id="retrieval_description", name="Retrieval Description"
        ),
    )
    .configurable_alternatives(
        ConfigurableField(id="type", name="Bot Type"),
        default_key="agent",
        prefix_keys=True,
        chatbot=chatbot,
        chat_retrieval=chat_retrieval,
    )
    .with_types(
        input_type=Messages,
        output_type=Sequence[AnyMessage],
    )
)

if __name__ == "__main__":
    import asyncio

    from langchain.schema.messages import HumanMessage

    async def run():
        async for m in agent.astream_events(
            HumanMessage(content="whats your name"),
            config={"configurable": {"user_id": "2", "thread_id": "test1"}},
            version="v1",
        ):
            print(m)

    asyncio.run(run())
