import React, { Fragment, useCallback, useEffect, useState } from "react";
import { ShareIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { orderBy, last } from "lodash";
import { v4 as uuidv4 } from "uuid";

import {
  ConfigListProps,
  Config as ConfigInterface,
} from "../hooks/useConfigList";
import { SchemaField, Schemas } from "../hooks/useSchemas";
import { cn } from "../utils/cn";
import { FileUploadDropzone } from "./FileUpload";
import { DROPZONE_CONFIG, TYPES } from "../constants";
import { Tool, ToolConfig, ToolSchema } from "../utils/formTypes";
import { useToolsSchemas } from "../hooks/useToolsSchemas";
import { marked } from "marked";

function Types(props: {
  field: SchemaField;
  value: string;
  readonly: boolean;
  setValue: (value: string) => void;
  alwaysExpanded?: boolean;
}) {
  const options =
    props.field.enum?.map((id) => TYPES[id as keyof typeof TYPES]) ?? [];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Select Type</label>
      <select
        className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        disabled={props.readonly}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
      >
        <option value="">Select a type</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function StringField(props: {
  id: string;
  field: SchemaField;
  value: string;
  title: string;
  readonly: boolean;
  setValue: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {props.title}
        {props.field.description && (
          <span className="ml-1 text-sm text-gray-500" title={props.field.description}>ⓘ</span>
        )}
      </label>
      <textarea
        id={props.id}
        value={props.value}
        readOnly={props.readonly}
        disabled={props.readonly}
        onChange={(e) => props.setValue(e.target.value)}
        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
      />
    </div>
  );
}

function SingleOptionField(props: {
  id: string;
  field: SchemaField;
  value: string;
  title: string;
  readonly: boolean;
  setValue: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {props.field.title}
        {props.field.description && (
          <span className="ml-1 text-sm text-gray-500" title={props.field.description}>ⓘ</span>
        )}
      </label>
      <select
        id={props.id}
        disabled={props.readonly}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select {props.field.title}</option>
        {orderBy(props.field.enum)?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

const ToolDisplay = (props: {
  tool: Tool;
  onRemoveTool: () => void;
  onUpdateToolConfig: (conf: ToolConfig) => void;
  readonly: boolean;
}) => {
  const { tool, onRemoveTool, onUpdateToolConfig, readonly } = props;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-4 overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="flex items-center justify-between px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{tool.name}</h3>
        {!readonly && (
          <button
            onClick={onRemoveTool}
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Remove
          </button>
        )}
      </div>
      {tool.description && (
        <div className="px-4 py-5 border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: marked(tool.description) }} />
        </div>
      )}
      <div className="border-t border-gray-200">
        <button
          className="flex items-center justify-between w-full px-4 py-5 text-left sm:px-6 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-sm font-medium text-gray-500">Configuration</span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {isOpen && (
          <div className="px-4 py-5 space-y-4 sm:px-6">
            {Object.entries(tool.config).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label htmlFor={`${tool.id}-${key}`} className="block text-sm font-medium text-gray-700">{key}</label>
                <input
                  id={`${tool.id}-${key}`}
                  value={value}
                  onChange={(e) => onUpdateToolConfig({ [key]: e.target.value })}
                  readOnly={readonly}
                  disabled={readonly}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function ToolSelectionField(props: {
  readonly: boolean;
  retrievalOn: boolean;
  selectedTools: Tool[];
  onAddTool: (tool: Tool) => void;
  onRemoveTool: (toolId: string) => void;
  onUpdateToolConfig: (
    toolId: string,
    config: {
      [key: string]: string;
    },
  ) => void;
}) {
  const { onAddTool, onRemoveTool, onUpdateToolConfig, retrievalOn, selectedTools, readonly } = props;
  const { tools: availableTools, loading } = useToolsSchemas();
  const [filteredTools, setFilteredTools] = useState<ToolSchema[]>([]);

  const handleSelectTool = useCallback(
    (toolName: string) => {
      const toolSchema = availableTools.find((t) => t.name === toolName);
      if (!toolSchema) return;

      const config: { [key: string]: string } = {};
      Object.keys(toolSchema.config.properties).forEach((key) => {
        const property = toolSchema.config.properties[key];
        config[key] = property.default || "";
      });

      const tool: Tool = {
        id: toolSchema.name === "Retrieval" ? "retrieval" : uuidv4(),
        type: toolSchema.type,
        name: toolSchema.name,
        description: toolSchema.description,
        config: config,
      };

      onAddTool(tool);
    },
    [onAddTool, availableTools],
  );

  useEffect(() => {
    const retrieval = availableTools.find((t) => t.name === "Retrieval");
    if (!retrieval) return;
    const retrievalSelected = selectedTools.some((t) => t.name === "Retrieval");
    if (retrievalOn && !retrievalSelected) {
      handleSelectTool("Retrieval");
    }
    if (!retrievalOn && retrievalSelected) {
      onRemoveTool("retrieval");
    }
  }, [
    retrievalOn,
    onRemoveTool,
    availableTools,
    handleSelectTool,
    selectedTools,
  ]);

  useEffect(() => {
    let toolSchemas = availableTools.filter(
      (tool) => tool.name !== "Retrieval",
    );
    toolSchemas = toolSchemas.filter(
      (tool) =>
        !selectedTools.some((t) => t.name === tool.name && !tool.multiUse),
    );
    setFilteredTools(toolSchemas);
  }, [availableTools, selectedTools]);

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Tools</label>
      {selectedTools.map((t) => (
        <ToolDisplay
          key={`tool-display-${t.id}`}
          tool={t}
          onRemoveTool={() => onRemoveTool(t.id)}
          onUpdateToolConfig={(conf) => onUpdateToolConfig(t.id, conf)}
          readonly={readonly || t.name === "Retrieval"}
        />
      ))}
      {!readonly && (
        <select
          onChange={(e) => handleSelectTool(e.target.value)}
          className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Add a tool</option>
          {filteredTools.map((tool) => (
            <option key={tool.name} value={tool.name}>
              {tool.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function PublicLink(props: { assistantId: string }) {
  const currentLink = window.location.href;
  const link = currentLink.includes(props.assistantId)
    ? currentLink
    : currentLink + "?shared_id=" + props.assistantId;
  return (
    <div className="flex items-center mb-4 space-x-2">
      <button
        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={async () => {
          await navigator.clipboard.writeText(link);
          alert("Copied to clipboard!");
        }}
      >
        <ShareIcon className="w-4 h-4 mr-2" />
        Copy Public Link
      </button>
      <input
        value={link}
        readOnly
        className="flex-1 p-2 text-xs border border-gray-300 rounded-md"
      />
    </div>
  );
}

function PublicToggle(props: {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center space-x-2", props.className)}>
      <input
        type="checkbox"
        id="public-mode"
        checked={props.enabled}
        onChange={(e) => props.setEnabled(e.target.checked)}
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label htmlFor="public-mode" className="text-sm text-gray-700">Public?</label>
    </div>
  );
}

function fileId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

const ORDER = [
  "system_message",
  "retrieval_description",
  "interrupt_before_action",
  "tools",
  "llm_type",
  "agent_type",
];

export function Config(props: {
  className?: string;
  configSchema: Schemas["configSchema"];
  configDefaults: Schemas["configDefaults"];
  config: ConfigInterface | null;
  saveConfig: ConfigListProps["saveConfig"];
  enterConfig: (id: string | null) => void;
  edit?: boolean;
}) {
  const [values, setValues] = useState(
    props.config?.config ?? props.configDefaults,
  );
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const typeKey = "type";
  const typeField =
    props.configSchema?.properties.configurable.properties[typeKey];
  const typeValue = values?.configurable?.[typeKey];
  const typeSpec = typeValue ? TYPES[typeValue as keyof typeof TYPES] : null;
  const [files, setFiles] = useState<File[]>([]);
  const dropzone = useDropzone(DROPZONE_CONFIG);
  const [isPublic, setPublic] = useState(props.config?.public ?? false);

  useEffect(() => {
    if (!values) return;
    if (!values.configurable) return;
    const tools = (values.configurable["type==agent/tools"] as Tool[]) ?? [];
    setSelectedTools((oldTools) =>
      oldTools !== tools ? [...tools] : oldTools,
    );
  }, [values]);

  const handleAddTool = (tool: Tool) => {
    setSelectedTools([...selectedTools, tool]);
  };

  const handleRemoveTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter((tool) => tool.id !== toolId));
  };

  const handleUpdateToolConfig = (toolId: string, config: ToolConfig) => {
    const updatedTools = selectedTools.map((tool) =>
      tool.id === toolId
        ? { ...tool, config: { ...tool.config, ...config } }
        : tool,
    );
    setSelectedTools(updatedTools);
  };

  useEffect(() => {
    setValues(props.config?.config ?? props.configDefaults);
  }, [props.config, props.configDefaults]);

  useEffect(() => {
    if (dropzone.acceptedFiles.length > 0) {
      const acceptedFileIds = dropzone.acceptedFiles.map(fileId);
      setFiles((files) => [
        ...files.filter((f) => !acceptedFileIds.includes(fileId(f))),
        ...dropzone.acceptedFiles,
      ]);
    }
  }, [dropzone.acceptedFiles, setFiles]);

  const [inflight, setInflight] = useState(false);
  const readonly = !!props.config && !props.edit && !inflight;

  const settings = !readonly ? (
    <div className="flex flex-col items-center gap-4 mb-6 sm:flex-row">
      <div className="flex-1 w-full">
        <input
          type="text"
          name="key"
          id="key"
          placeholder="Name your bot"
          defaultValue={props.config?.name}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={inflight}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {inflight ? "Saving..." : "Save"}
      </button>
      <PublicToggle enabled={isPublic} setEnabled={setPublic} />
    </div>
  ) : (
    <>
      {props.config?.public && (
        <PublicLink assistantId={props.config?.assistant_id} />
      )}
    </>
  );

  return (
    <form
      className={cn("space-y-8", props.className)}
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.target as HTMLFormElement;
        const key = (form.elements.namedItem("key") as HTMLInputElement).value;
        if (!key) return;
        setInflight(true);
        const vals = { ...values };
        if (vals?.configurable) {
          vals.configurable = { ...vals.configurable };
          vals.configurable["type==agent/tools"] = [...selectedTools];
        }
        const assistantId = await props.saveConfig(
          key,
          vals!,
          files,
          isPublic,
          props.config?.assistant_id,
        );
        props.enterConfig(assistantId);
        setInflight(false);
      }}
    >
      {settings}
      {typeField && (
        <Types
          field={typeField}
          value={typeValue as string}
          setValue={(value: string) =>
            setValues({
              ...values,
              configurable: { ...values!.configurable, [typeKey]: value },
            })
          }
          readonly={readonly}
        />
      )}

      {typeSpec?.description && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <div className="text-sm text-gray-500">{typeSpec.description}</div>
        </div>
      )}

      {!props.config && typeSpec?.files && (
        <FileUploadDropzone
          state={dropzone}
          files={files}
          setFiles={setFiles}
        />
      )}
      <div className={cn("space-y-8", readonly && "opacity-50")}>
        {orderBy(
          Object.entries(
            props.configSchema?.properties.configurable.properties ?? {},
          ),
          ([key]) => ORDER.indexOf(last(key.split("/"))!),
        ).map(([key, value]) => {
          const title = value.title;
          if (key.split("/")[0].includes("==")) {
            const [parentKey, parentValue] = key.split("/")[0].split("==");
            if (values?.configurable?.[parentKey] !== parentValue) {
              return null;
            }
          } else {
            return null;
          }
          if (
            last(key.split("/")) === "retrieval_description" &&
            !files.length
          ) {
            return null;
          }
          if (value.type === "string" && value.enum) {
            return (
              <SingleOptionField
                key={key}
                id={key}
                field={value}
                title={title}
                value={values?.configurable?.[key] as string}
                setValue={(value: string) =>
                  setValues({
                    ...values,
                    configurable: { ...values!.configurable, [key]: value },
                  })
                }
                readonly={readonly}
              />
            );
          } else if (value.type === "string") {
            return (
              <StringField
                key={key}
                id={key}
                field={value}
                title={title}
                value={values?.configurable?.[key] as string}
                setValue={(value: string) =>
                  setValues({
                    ...values,
                    configurable: { ...values!.configurable, [key]: value },
                  })
                }
                readonly={readonly}
              />
            );
          } else if (value.type === "boolean") {
            return (
              <SingleOptionField
                key={key}
                id={key}
                field={{
                  ...value,
                  type: "string",
                  enum: ["Yes", "No"],
                }}
                title={title}
                value={values?.configurable?.[key] ? "Yes" : "No"}
                setValue={(value: string) =>
                  setValues({
                    ...values,
                    configurable: {
                      ...values!.configurable,
                      [key]: value === "Yes",
                    },
                  })
                }
                readonly={readonly}
              />
            );
          } else if (key === "type==agent/tools") {
            return (
              <ToolSelectionField
                key={key}
                selectedTools={selectedTools}
                onAddTool={handleAddTool}
                onRemoveTool={handleRemoveTool}
                onUpdateToolConfig={handleUpdateToolConfig}
                readonly={readonly}
                retrievalOn={files.length > 0}
              />
            );
          }
        })}
      </div>
    </form>
  );
}