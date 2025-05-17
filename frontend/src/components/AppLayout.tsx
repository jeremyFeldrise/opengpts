import { FC, ReactNode, useCallback } from "react"
import SidebarComponent from "./sidebar-component"
import { useChatList } from "../hooks/useChatList"
import { Message } from "../types.ts";
import { MessageWithFiles } from "../utils/formTypes"
import {
  useConfigList,
  Config as ConfigInterface,
} from "../hooks/useConfigList";
import { useNavigate } from "react-router-dom";
import { useStreamState } from "../hooks/useStreamState";
import { useThreadAndAssistant } from "../hooks/useThreadAndAssistant";
import { ChatList } from "./ChatList";

type propsType = {
  children?: ReactNode
}

const AppLayout: FC<propsType> = ({ children }) => {
  const navigate = useNavigate()
  const { chats, createChat, updateChat, deleteChat } = useChatList();
  const { configs, saveConfig, deleteConfig } = useConfigList();
  const { startStream, stopStream, stream } = useStreamState();
  const { currentChat, assistantConfig, isLoading } = useThreadAndAssistant();

  const startTurn = useCallback(
    async (
      message: MessageWithFiles | null,
      thread_id: string,
      assistantType: string,
      config?: Record<string, unknown>,
    ) => {
      const files = message?.files || [];
      if (files.length > 0) {
        const formData = files.reduce((formData, file) => {
          formData.append("files", file);
          return formData;
        }, new FormData());
        formData.append(
          "config",
          JSON.stringify({ configurable: { thread_id } }),
        );
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/ingest`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let input: Message[] | Record<string, any> | null = null;

      if (message) {
        // Set the input to an array of messages. This is the default input
        // format for all assistant types.
        input = [
          {
            content: message.message,
            additional_kwargs: {},
            type: "human",
            example: false,
            id: `human-${Math.random()}`,
          },
        ];

        if (assistantType === "chat_retrieval") {
          // The RAG assistant type requires an object with a `messages` field.
          input = {
            messages: input,
          };
        }
      }

      await startStream(input, thread_id, config);
    },
    [startStream],
  );

  const startChat = useCallback(
    async (config: ConfigInterface, message: MessageWithFiles) => {
      const chat = await createChat(message.message, config.assistant_id);
      navigate(`/thread/${chat.thread_id}`);
      const assistantType = config.config.configurable?.type as string;
      return startTurn(message, chat.thread_id, assistantType);
    },
    [createChat, navigate, startTurn],
  );

  const selectChat = useCallback(
    async (id: string | null) => {
      if (currentChat) {
        stopStream?.(true);
      }
      if (!id) {
        const firstAssistant = configs?.[0]?.assistant_id ?? null;
        navigate(firstAssistant ? `/assistant/${firstAssistant}` : "/");
        window.scrollTo({ top: 0 });
      } else {
        navigate(`/thread/${id}`);
      }
    },
    [currentChat, stopStream, configs, navigate],
  );

  const selectConfig = useCallback(
    (id: string | null) => {
      navigate(id ? `/assistant/${id}` : "/");
    },
    [navigate],
  );
  return (
    <div className="h-screen">
      <SidebarComponent
        newChat={selectChat}
        chat={
          <ChatList
            chats={chats}
            enterConfig={selectConfig}
            enterChat={selectChat}
            deleteChat={deleteChat}
            configs={configs}
          />
        } />
      <div className="transition-all duration-300 ease-in-out mx-auto pl-[277px]">
        <div className="max-w-[1073px] mx-auto p-10">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AppLayout;
