import { Pencil, Trash } from "lucide-react";
import { Config, ConfigListProps } from "../hooks/useConfigList";
import { cn } from "../utils/cn";
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
            ? "bg-gray-100"
            : "bg-white hover:border-gray-300 hover:bg-gray-50",
          "border-gray-100 group flex items-center gap-x-3 rounded-lg py-3 px-4 text-sm leading-6 cursor-pointer transition-all duration-200 border shadow",
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-lg truncate">
              {props.config.name}
            </span>
            <div className="flex">
              <Link
                className="ml-2 text-gray-500 transition-colors duration-200 hover:text-black"
                to={`/assistant/${props.config.assistant_id}/edit`}
                onClick={(event) => event.stopPropagation()}
              >
                <Pencil className="text-blue-400" />
              </Link>
              <button className="ml-2 text-gray-500 transition-colors duration-200 hover:text-black">
                <Trash
                  className="text-blue-400"
                  onClick={(event) => {
                    event.stopPropagation();
                    props.deleteConfig(props.config.assistant_id);
                  }}
                />
              </button>
            </div>
          </div>
          <div className="mt-1 text-sm truncate text-gray-500">
            {props.config.name}
          </div>
          <div className="flex mt-2">
            <div className="bg-gradient-to-l from-blue-500 to-purple-500 px-2 py-1 text-white text-xs rounded-full ">GPT 4o</div>
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
