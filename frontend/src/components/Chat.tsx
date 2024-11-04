import { useEffect, useRef, useState } from "react";
import { StreamStateProps } from "../hooks/useStreamState";
import { useChatMessages } from "../hooks/useChatMessages";
import TypingBox from "./TypingBox";
import { MessageViewer } from "./Message";
import {
  ArrowDownCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { MessageWithFiles } from "../utils/formTypes.ts";
import { useParams } from "react-router-dom";
import { useThreadAndAssistant } from "../hooks/useThreadAndAssistant.ts";
import { useMessageEditing } from "../hooks/useMessageEditing.ts";
import { MessageEditor } from "./MessageEditor.tsx";
import { Message } from "../types.ts";

interface ChatProps extends Pick<StreamStateProps, "stream" | "stopStream"> {
  startStream: (
    message: MessageWithFiles | null,
    thread_id: string,
    assistantType: string,
  ) => Promise<void>;
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function CommitEdits(props: {
  editing: Record<string, Message>;
  commitEdits: () => Promise<void>;
}) {
  const [inflight, setInflight] = useState(false);
  return (
    <div className="flex flex-row items-center text-blue-800 rounded-md bg-blue-50 ring-1 ring-inset ring-blue-800/60 h-9">
      <div className="flex-1 pl-4 rounded-l-md">
        {Object.keys(props.editing).length} message(s) edited.
      </div>
      <button
        onClick={async () => {
          setInflight(true);
          await props.commitEdits();
          setInflight(false);
        }}
        className={
          "self-stretch -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 " +
          "text-sm font-semibold ring-1 ring-inset ring-blue-800/60 hover:bg-blue-100 "
        }
      >
        <CheckCircleIcon
          className="w-6 h-6 transition-opacity duration-100 cursor-pointer stroke-2 opacity-80 hover:opacity-100"
          onMouseUp={props.commitEdits}
        />

        {inflight ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export function Chat(props: ChatProps) {
  const { chatId } = useParams();
  const { messages, next, refreshMessages } = useChatMessages(
    chatId ?? null,
    props.stream,
    props.stopStream,
  );
  const { currentChat, assistantConfig, isLoading } = useThreadAndAssistant();
  const { editing, recordEdits, commitEdits, abandonEdits } = useMessageEditing(
    chatId,
    refreshMessages,
  );

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

  if (isLoading) return <div>Loading...</div>;
  if (!currentChat || !assistantConfig) return <div>No data.</div>;

  return (
    <div className="flex-1 flex flex-col items-stretch pb-[76px] pt-2">
      {messages?.map((msg, i) =>
        editing[msg.id] ? (
          <MessageEditor
            key={msg.id}
            message={editing[msg.id]}
            onUpdate={recordEdits}
            abandonEdits={() => abandonEdits(msg)}
          />
        ) : (
          <MessageViewer
            {...msg}
            key={msg.id}
            runId={
              i === messages.length - 1 && props.stream?.status === "done"
                ? props.stream?.run_id
                : undefined
            }
            startEditing={() => recordEdits(msg)}
            alwaysShowControls={i === messages.length - 1}
          />
        ),
      )}
      {(props.stream?.status === "inflight" || messages === null) && (
        <div className="mb-2 text-lg font-black leading-6 text-gray-400 animate-pulse">
          ...
        </div>
      )}
      {props.stream?.status === "error" && (
        <div className="flex items-center px-2 py-1 text-xs font-medium text-yellow-800 rounded-md bg-yellow-50 ring-1 ring-inset ring-yellow-600/20">
          An error has occurred. Please try again.
        </div>
      )}
      {next.length > 0 &&
        props.stream?.status !== "inflight" &&
        Object.keys(editing).length === 0 && (
          <div
            className="flex items-center px-2 py-1 text-xs font-medium text-blue-800 rounded-md cursor-pointer bg-blue-50 ring-1 ring-inset ring-yellow-600/20"
            onClick={() =>
              props.startStream(
                null,
                currentChat.thread_id,
                assistantConfig.config.configurable?.type as string,
              )
            }
          >
            <ArrowDownCircleIcon className="w-5 h-5 mr-1" />
            Click to continue.
          </div>
        )}
      <div className="fixed bottom-0 left-0 right-0 p-4 lg:left-72">
        {commitEdits && Object.keys(editing).length > 0 ? (
          <CommitEdits editing={editing} commitEdits={commitEdits} />
        ) : (
          <TypingBox
            onSubmit={(msg) =>
              props.startStream(
                msg,
                currentChat.thread_id,
                assistantConfig.config.configurable?.type as string,
              )
            }
            onInterrupt={
              props.stream?.status === "inflight" ? props.stopStream : undefined
            }
            inflight={props.stream?.status === "inflight"}
            currentConfig={assistantConfig}
            currentChat={currentChat}
          />
        )}
      </div>
    </div>
  );
}
