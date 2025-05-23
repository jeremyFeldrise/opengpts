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
        className="rounded-xl border shadow px-6 py-4"
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
      <div className="text-lg font-semibold leading-6 mb-3">
        Bots
      </div>
      <ul role="list" className="space-y-4">
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

      <div className="my-4 text-lg font-semibold leading-6">
        Public Bots
      </div>
      <ul role="list" className="space-y-1">
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
