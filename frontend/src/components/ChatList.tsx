import { useState, useEffect } from "react";

import { ChatListProps } from "../hooks/useChatList";
import { ConfigListProps } from "../hooks/useConfigList.ts";
import { Button } from "./button.tsx";
import { Ellipsis } from "lucide-react";

export function ChatList(props: {
  chats: ChatListProps["chats"];
  configs: ConfigListProps["configs"];
  enterChat: (id: string | null) => void;
  deleteChat: (id: string, name: string) => void;
  enterConfig: (id: string | null) => void;
}) {
  // const { currentChat, assistantConfig } = useThreadAndAssistant();

  // State for tracking which chat's menu is visible
  const [visibleMenu, setVisibleMenu] = useState<string | null>(null);

  // Event listener to close the menu when clicking outside of it
  useEffect(() => {
    const closeMenu = () => setVisibleMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <>
      <ul role="list" className="mt-2 space-y-3 max-h-[350px] overflow-auto">
        {props.chats?.map((chat) => (
          <li key={chat.thread_id} className="w-full flex justify-between mb-2">
            <Button
              onClick={() => props.enterChat(chat.thread_id)}
              variant='ghost'
              className="p-0 text-left"
            >
              <div>
                <div className="truncate font-light text-base max-w-[165px]">
                  {chat.name ?? " "}
                </div>
                <div className="text-md font-light text-gray-400 truncate max-w-[165px]">
                  {
                    props.configs?.find(
                      (config) => config.assistant_id === chat.assistant_id,
                    )?.name
                  }
                </div>
              </div>
            </Button>
            <Button
              onClick={(event) => {
                event.stopPropagation(); // Prevent triggering click for the chat item
                setVisibleMenu(
                  visibleMenu === chat.thread_id ? null : chat.thread_id,
                );
              }}
              variant="ghost"
              className="p-0"
            ><Ellipsis /></Button>
            {/* Menu Dropdown */}
            {visibleMenu === chat.thread_id && (
              <div className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={(event) => {
                      event.preventDefault();
                      props.deleteChat(chat.thread_id, chat.name);
                    }}
                  >
                    Delete
                  </a>
                </div>
              </div>
            )}
          </li>
        )) ?? (
            <li className="p-2 text-lg font-black leading-6 text-gray-400 animate-pulse">
              ...
            </li>
          )}
      </ul>
    </>
  );
}
