import { TYPES } from "../constants";
import { Config, ConfigListProps } from "../hooks/useConfigList";
import { cn } from "../utils/cn";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function ConfigItem(props: {
  config: Config;
  currentConfig: Config | null;
  enterConfig: (id: string | null) => void;
  deleteConfig: (id: string) => void;
}) {
  return (
    <li key={props.config.assistant_id} className="mb-2">
      <div
        onClick={() => props.enterConfig(props.config.assistant_id)}
        className={cn(
          props.config.assistant_id === props.currentConfig?.assistant_id
            ? "bg-gray-100 border-gray-300"
            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50",
          "group flex items-center gap-x-3 rounded-lg p-3 text-sm leading-6 cursor-pointer transition-all duration-200 border shadow-sm",
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-semibold",
            props.config.assistant_id === props.currentConfig?.assistant_id
              ? "bg-black text-white"
              : "bg-gray-100 text-black group-hover:bg-black group-hover:text-white",
          )}
        >
          {props.config.name?.[0] ?? " "}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-black truncate">
              {props.config.name}
            </span>
            <Link
              className="ml-2 text-gray-500 transition-colors duration-200 hover:text-black"
              to={`/assistant/${props.config.assistant_id}/edit`}
              onClick={(event) => event.stopPropagation()}
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {props.config.name}
          </div>
        </div>
      </div>
    </li>
  );
}

export function ConfigList(props: {
  configs: ConfigListProps["configs"];
  currentConfig: Config | null;
  enterConfig: (id: string | null) => void;
  deleteConfig: (id: string) => void;
}) {
  return (
    <>
      <div className="text-xs font-semibold leading-6 text-gray-400">
        Your Saved Bots
      </div>
      <ul role="list" className="mt-2 -mx-2 space-y-1">
        {props.configs
          ?.filter((a) => a.mine)
          .map((assistant) => (
            <ConfigItem
              key={assistant.assistant_id}
              config={assistant}
              currentConfig={props.currentConfig}
              enterConfig={props.enterConfig}
              deleteConfig={props.deleteConfig}
            />
          )) ?? (
            <li className="p-2 text-lg font-black leading-6 text-gray-400 animate-pulse">
              ...
            </li>
          )}
      </ul>

      <div className="mt-4 text-xs font-semibold leading-6 text-gray-400">
        Public Bots
      </div>
      <ul role="list" className="mt-2 -mx-2 space-y-1">
        {props.configs
          ?.filter((a) => !a.mine)
          .map((assistant) => (
            <ConfigItem
              key={assistant.assistant_id}
              config={assistant}
              currentConfig={props.currentConfig}
              enterConfig={props.enterConfig}
              deleteConfig={props.deleteConfig}
            />
          )) ?? (
            <li className="p-2 text-lg font-black leading-6 text-gray-400 animate-pulse">
              ...
            </li>
          )}
      </ul>
    </>
  );
}
