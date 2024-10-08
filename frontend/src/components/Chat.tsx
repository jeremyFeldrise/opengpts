import { useEffect, useRef } from "react";
import { StreamStateProps } from "../hooks/useStreamState";
import { useChatMessages } from "../hooks/useChatMessages";
import TypingBox from "./TypingBox";
import { MessageViewer } from "./Message";
import { MessageWithFiles } from "../utils/formTypes.ts";
import { useParams } from "react-router-dom";
import { useThreadAndAssistant } from "../hooks/useThreadAndAssistant.ts";
import { ChevronDown, Loader2 } from "lucide-react";

interface ChatProps extends Pick<StreamStateProps, "stream" | "stopStream"> {
  startStream: (
    message: MessageWithFiles | null,
    thread_id: string,
  ) => Promise<void>;
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function Chat(props: ChatProps) {
  const { chatId } = useParams();
  const { messages, next } = useChatMessages(
    chatId ?? null,
    props.stream,
    props.stopStream,
  );

  const { currentChat, assistantConfig, isLoading } = useThreadAndAssistant();

  const prevMessages = usePrevious(messages);
  useEffect(() => {
    scrollTo({
      top: document.body.scrollHeight,
      behavior:
        prevMessages && prevMessages?.length === messages?.length
          ? "smooth"
          : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  if (isLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 text-gray-500 animate-spin" /></div>;
  if (!currentChat || !assistantConfig) return <div className="text-center text-gray-500">No data available.</div>;

  return (
    <div className="flex-1 flex flex-col items-stretch pb-[76px] pt-2 px-4 lg:px-8 bg-gray-50">
      {messages?.map((msg, i) => (
        <MessageViewer
          {...msg}
          key={msg.id}
          runId={
            i === messages.length - 1 && props.stream?.status === "done"
              ? props.stream?.run_id
              : undefined
          }
        />
      ))}
      {(props.stream?.status === "inflight" || messages === null) && (
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}
      {props.stream?.status === "error" && (
        <div className="flex items-center px-3 py-2 text-sm font-medium text-red-800 bg-red-100 rounded-md ring-1 ring-inset ring-red-200">
          An error has occurred. Please try again.
        </div>
      )}
      {next.length > 0 && props.stream?.status !== "inflight" && (
        <div
          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 transition-colors rounded-md cursor-pointer bg-blue-50 ring-1 ring-inset ring-blue-200 hover:bg-blue-100"
          onClick={() => props.startStream(null, currentChat.thread_id)}
        >
          <ChevronDown className="w-4 h-4 mr-2" />
          Continue conversation
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:left-72 lg:p-8">
        <TypingBox
          onSubmit={(msg) => props.startStream(msg, currentChat.thread_id)}
          onInterrupt={
            props.stream?.status === "inflight" ? props.stopStream : undefined
          }
          inflight={props.stream?.status === "inflight"}
          currentConfig={assistantConfig}
          currentChat={currentChat}
        />
      </div>
    </div>
  );
}