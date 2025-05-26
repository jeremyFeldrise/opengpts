import { ConfigList } from "./ConfigList";
import { Schemas } from "../hooks/useSchemas";
import TypingBox from "./TypingBox";
import {
  ConfigListProps,
  Config as ConfigInterface,
  useConfigList,
} from "../hooks/useConfigList";
import { cn } from "../utils/cn";
import { MessageWithFiles } from "../utils/formTypes.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useThreadAndAssistant } from "../hooks/useThreadAndAssistant.ts";
import { Button } from "./button.tsx";
import { ChevronDown, Ellipsis, Trash, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.tsx";
import { useState } from "react";
import { useChatList } from "../hooks/useChatList.ts";
import ModalComponent from "./modalComponent.tsx";

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

type DeletedType = {
  id: string,
  name: string
}

export function NewChat(props: NewChatProps) {
  const navigator = useNavigate();
  const [choosenAssist, setChoosenAssist] = useState<string | number | null>()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoadingDel, setIsLoadingDel] = useState(false)
  const [deleteId, setDeleteId] = useState<DeletedType | null>(null)
  const { chats, deleteChat } = useChatList();
  const { assistantId } = useParams();
  const { configs } = useConfigList();
  const { assistantConfig, isLoading } = useThreadAndAssistant();

  const handleClose = () => {
    setIsOpen(false)
    setDeleteId(null)
    setIsLoadingDel(false)
  }

  const handleConfirm = (id: string, name: string) => {
    setIsOpen(true)
    setDeleteId({
      id,
      name
    })
  }

  const handleDelete = async () => {
    setIsLoadingDel(true)
    await deleteChat(deleteId?.id || '').finally(() => handleClose())
  }

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
          <div className="grow mr-4">
            <div className="text-xl font-semibold mb-2">Last Chats</div>
            <ul className="grid grid-cols-1 gap-y-6">
              {
                chats?.slice(-4).map((chat, i) => (
                  <li key={i}>
                    <div className="flex justify-between items-center border rounded-xl px-6 py-4 shadow">
                      <div>
                        <div className="text-xl mb-2">{chat.name}</div>
                        <div className="text-sm text-gray-400 font-light">
                          {
                            configs?.find(
                              (config) => config.assistant_id === chat.assistant_id,
                            )?.name
                          }
                        </div>
                      </div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="p-0"
                            ><Ellipsis /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-white">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => {
                              handleConfirm(chat.assistant_id, chat.name)
                            }}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="md:w-72">
            <ConfigList
              configs={props.configs}
              currentConfig={assistantConfig}
              enterConfig={(id) => navigator(`/assistant/${id}`)}
              deleteConfig={props.deleteConfig}
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 left-0">
          <TypingBox
            onSubmit={async (msg: MessageWithFiles) => {
              if (assistantConfig) {
                await props.startChat(assistantConfig, msg);
              }
            }}
            currentConfig={assistantConfig}
            currentChat={null}
            action={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button rightElem={<ChevronDown className="w-4 h-4 text-gray-500" />} variant="outline" className="rounded-full px-3 mr-3 w-full flex items-center space-x-2">
                    {
                      choosenAssist ? choosenAssist : 'Choose bot'
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  {props.configs
                    ?.filter((a) => a.mine)
                    .map((assistant) => (
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        navigator(`/assistant/${assistant.assistant_id}`)
                        setChoosenAssist(assistant.name)
                      }}>{assistant.name}</DropdownMenuItem>
                    )) ?? (
                      <div>Loading...</div>
                    )}
                </DropdownMenuContent>
              </DropdownMenu>

            }
          />
        </div>
      </div>
      <ModalComponent isOpen={isOpen} onClose={handleClose} title={deleteId?.name || ''}>
        <div className="">
          <div className="text-sm mb-4 text-gray-400 font-light">Warning: This action cannot be undone. All intelligences, agents, and data associated with this project will be permanently deleted. Applications using this project will no longer be able to access its functionalities.</div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              disabled={isLoadingDel}
              variant="outline"
              rightElem={<X />}
              onClick={() => {
                setIsOpen(false)
                setDeleteId(null)
              }}>Cancel</Button>
            <Button
              disabled={isLoadingDel}
              onClick={handleDelete}
              rightElem={<Trash />}
            >
              {isLoadingDel ? "Please wait..." : "Confirm"}
            </Button>
          </div>
        </div>
      </ModalComponent>
    </>
  );
}
