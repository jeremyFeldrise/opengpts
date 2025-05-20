import { ConfigList } from "./ConfigList";
import { Schemas } from "../hooks/useSchemas";
import TypingBox from "./TypingBox";
import { Config } from "./Config";
import {
  ConfigListProps,
  Config as ConfigInterface,
} from "../hooks/useConfigList";
import { cn } from "../utils/cn";
import { MessageWithFiles } from "../utils/formTypes.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useThreadAndAssistant } from "../hooks/useThreadAndAssistant.ts";
import { Button } from "./button.tsx";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.tsx";

interface NewChatProps extends ConfigListProps {
  name?: string
  description?: string
  configSchema: Schemas["configSchema"];
  configDefaults: Schemas["configDefaults"];
  enterConfig: (id: string | null) => void;
  deleteConfig: (id: string) => Promise<void>;
  startChat: (
    config: ConfigInterface,
    message: MessageWithFiles,
  ) => Promise<void>;
}

export function NewChat(props: NewChatProps) {
  const navigator = useNavigate();
  const { assistantId } = useParams();

  const { assistantConfig, isLoading } = useThreadAndAssistant();

  if (isLoading) return <div>Loading...</div>;
  if (!assistantConfig)
    return <div>Could not find assistant with given id.</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="text-3xl">{props?.name}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button rightElem={<ChevronDown />} >Action</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="" onClick={() => console.log("test")}>Edit project</DropdownMenuItem>
            <DropdownMenuItem className="" onClick={() => navigator("/")}>Add bot</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-base text-gray-400 mb-10 font-light">{props?.description}</div>
      <div
        className={cn(
          "flex flex-col items-stretch",
          assistantConfig ? "pb-[76px]" : "pb-6",
        )}
      >
        <div className="flex-1 flex flex-col md:flex-row lg:items-stretch self-stretch">
          <div className="md:w-72 pr-6">
            <ConfigList
              configs={props.configs}
              currentConfig={assistantConfig}
              enterConfig={(id) => navigator(`/assistant/${id}`)}
              deleteConfig={props.deleteConfig}
            />
          </div>
        </div>
        <div className="fixed left-0 lg:left-72 bottom-0 right-0 p-4">
          <TypingBox
            onSubmit={async (msg: MessageWithFiles) => {
              if (assistantConfig) {
                await props.startChat(assistantConfig, msg);
              }
            }}
            currentConfig={assistantConfig}
            currentChat={null}
          />
        </div>
      </div>
    </>
  );
}
