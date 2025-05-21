import { ChangeEvent, useCallback, useEffect, useState, MouseEvent } from "react";
import { ShareIcon, ChevronDown, ChevronUp, Headset, X, ArrowRight, Check } from "lucide-react";
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
import { marked, use } from "marked";
import { getAgentPrice } from "../hooks/useAgentPrice";
import { Button } from "./button";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Switch } from "./switch";

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
    <div className="mb-4">
      <div className="mb-2 text-base">Select Type</div>
      <Select
        disabled={props.readonly}
        value={props.value}
        onValueChange={(value) => props.setValue(value)}
      >
        <SelectTrigger className="border-gray-200 shadow">
          <SelectValue placeholder="Select a type" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>{option.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
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
      <div className="text-base mb-2">
        {props.title}
        {props.field.description && (
          <span className="ml-1 text-sm text-gray-500" title={props.field.description}>ⓘ</span>
        )}
      </div>
      <textarea
        id={props.id}
        value={props.value}
        readOnly={props.readonly}
        disabled={props.readonly}
        onChange={(e) => props.setValue(e.target.value)}
        className="mt-1 p-4 bg-transparent border border-gray-200 shadow block w-full sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
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
    <div className="">
      <div className="text-base mb-2">
        {props.field.title}
        {
          props.field.description && (
            <span className="text-sm pl-2" title={props.field.description}>ⓘ</span>
          )
        }
      </div>
      <Select
        value={props.value}
        onValueChange={(value) => props.setValue(value)}
      >
        <SelectTrigger className="border-gray-200 shadow">
          <SelectValue placeholder={props.field.title} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {orderBy(props.field.enum)?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

type ItemToolProps = {
  item: ToolSchema,
  readonly: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onUpdateToolConfig: (conf: ToolConfig) => void;
}

function ItemTool({ item, readonly, onChange, onUpdateToolConfig }: ItemToolProps) {
  const [displayConfig, setDisplayConfig] = useState(false)

  return (
    <>
      <label htmlFor={`option-${item.name}`} className="cursor-pointer">
        <input
          type="checkbox"
          name="options"
          id={`option-${item.name}`}
          value={item.name}
          className="peer invisible absolute"
          onChange={(e) => onChange(e)}
        />
        <div className="
          rounded-lg 
          p-6 
          flex flex-col
          shadow-[0px_0px_10px_0px_rgba(56,56,56,0.15)]
          transition-all 
          peer-checked:border-blue-600 
          peer-checked:bg-purple-50 
          peer-checked:ring-2 
          peer-checked:ring-purple-300
          h-full"
        >
          <h3 className="text-lg font-medium mb-2">{item.name}</h3>
          <p className="text-sm font-light text-gray-400">
            {item.description}
          </p>
          {
            Object.keys(item.config.properties).length !== 0 && (
              <div>
                <Button variant="ghost" className="w-full flex justify-between p-0 mt-4" onClick={() => setDisplayConfig(!displayConfig)}>Configuration {
                  displayConfig ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />)}</Button>
                {
                  displayConfig && (
                    <div className="mt-4">
                      {Object.entries(item.config.properties).map(([key, value]) => (
                        <div key={key} className="mb-3 space-y-2">
                          <label htmlFor={key} className="block text-sm font-medium">{value.title}</label>
                          <Input
                            id={key}
                            value={value.title}
                            onChange={(e) => onUpdateToolConfig({ [key]: e.target.value })}
                            readOnly={readonly}
                            disabled={readonly}
                          />
                        </div>
                      ))}

                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </label>
    </>
  )
}

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

  const handleCheckedTool = (e: ChangeEvent<HTMLInputElement>) => {
    const state = e.target.checked
    if (state) {
      handleSelectTool(e.target.value)
    } else {
      const toolSchema = availableTools.find((t) => t.name === e.target.value)
      const id = toolSchema?.name === "Retrieval" ? "retrieval" : uuidv4()

      onRemoveTool(id)
    }
  }

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
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-10">
      {!readonly && (
        <>
          {
            filteredTools.map((item, i) => {
              return (
                <ItemTool
                  key={i}
                  item={item}
                  onChange={(e) => handleCheckedTool(e)}
                  readonly={readonly}
                  onUpdateToolConfig={function (conf: ToolConfig): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              )
            })
          }
        </>
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
      <Switch
        id="public-mode"
        checked={props.enabled}
        onCheckedChange={(value) => props.setEnabled(value)}
      />
      <label htmlFor="public-mode" className="text-base">Make this bot public</label>
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
  const steps = ['General Details', 'AI Configuration', 'Tools']
  const [currentStep, setCurrentStep] = useState(0)
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
  const { price, isLoading, refetchPrice } = getAgentPrice(values?.configurable?.["type==agent/agent_type"] as string);

  const handlePrev = () => {
    if (currentStep !== 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  useEffect(() => {
    if (!values) return;
    if (!values.configurable) return;
    const tools = (values.configurable["type==agent/tools"] as Tool[]) ?? [];
    setSelectedTools((oldTools) =>
      oldTools !== tools ? [...tools] : oldTools,
    );
    refetchPrice();
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
    <div className="mb-4">
      <div className="text-md mb-2">Bot Name</div>
      <div className="flex-1 w-full">
        <Input
          type="text"
          name="key"
          id="key"
          placeholder="Name your bot"
          defaultValue={props.config?.name}
        />
      </div>
    </div>
  ) : (
    <>
      {props.config?.public && (
        <PublicLink assistantId={props.config?.assistant_id} />
      )}
    </>
  );

  return (
    <>
      <div className="relative m-auto w-full max-w-[496px] mb-20">
        <div className="h-[2px] w-full bg-purple-200 absolute top-[50%]">
          <div style={{ width: `${100 * (currentStep + 1) / steps.length}%` }} className="h-[2px] bg-purple-500 absolute"></div>
        </div>
        <div className="flex justify-between mb-8">
          {steps.map((label, index) => (
            <div key={index} className="flex flex-col items-center relative">
              <div
                className={`w-4 h-4 flex items-center justify-center rounded-full text-white ${index <= currentStep ? 'bg-purple-500' : 'bg-purple-200'
                  }`}
              >
              </div>
              <span className="text-sm mt-2 absolute whitespace-nowrap top-6">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <form
        className={cn("space-y-8 max-w-[800px] m-auto", props.className)}
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
        <div className={currentStep === 0 ? 'block' : 'hidden'}>
          <div className="text-center text-3xl font-bold mb-8">General Details</div>
          <div className="text-gray-400 text-base text-center mb-10">Define your bot's essential information, such as its name and type. These parameters determine the basic functionality available.</div>
          <div className="m-auto max-w-[640px]">
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
              <div className="flex px-8 py-4 rounded-xl mb-8 shadow space-x-4 border">
                <div>
                  <Headset size={32} className="text-purple-500" />
                </div>
                <div>
                  <div className="text-lg mb-2">{typeSpec.title}</div>
                  <div className="text-sm text-gray-400">{typeSpec.description}</div>
                </div>
              </div>
            )}

            {!props.config && typeSpec?.files && (
              <FileUploadDropzone
                state={dropzone}
                files={files}
                setFiles={setFiles}
              />
            )}
          </div>
        </div>

        <div className={currentStep === 1 ? 'block' : 'hidden'}>
          <div className="text-center text-3xl font-bold mb-8">AI Setup</div>
          <div className="text-gray-400 text-base text-center mb-10">Select the AI model and define the instructions that will guide your bot's behavior. This is where you customize its capabilities and communication style.</div>
          <div className="m-auto max-w-[640px]">
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
                }
              })}
              <div className="flex justify-between items-center border border-gray-200 p-4 rounded-xl shadow">Thread price :
                {
                  isLoading ? (
                    <div className="text-md text-gray-400">Loading...</div>
                  ) : (
                    <div className="text-md text-gray-400"> {price?.price} Credits</div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        <div className={currentStep === 2 ? 'block' : 'hidden'}>
          <div className="text-center text-3xl font-bold mb-8">Add tools</div>
          <div className="text-gray-400 text-base text-center mb-10">Select the AI model and define the instructions that will guide your bot's behavior. This is where you customize its capabilities and communication style.</div>
          <div className="m-auto">
            {
              values?.configurable?.['type'] === 'agent' && props.configSchema?.properties.configurable.properties['type==agent/tools'] && (
                <ToolSelectionField
                  key="type==agent/tools"
                  selectedTools={selectedTools}
                  onAddTool={handleAddTool}
                  onRemoveTool={handleRemoveTool}
                  onUpdateToolConfig={handleUpdateToolConfig}
                  readonly={readonly}
                  retrievalOn={files.length > 0}
                />
              )
            }
            <PublicToggle enabled={isPublic} setEnabled={setPublic} />
          </div>
        </div>
        <div className="m-auto max-w-[640px] grid grid-cols-2 gap-4">
          <Button disabled={currentStep === 0} rightElem={<X />} size="lg" variant="outline" onClick={handlePrev}>Back</Button>
          {
            currentStep === steps.length - 1 ? (

              <Button
                size="lg"
                type="submit"
                disabled={inflight}
                rightElem={<Check />}
              >
                {inflight ? "Saving..." : "Save"}
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={(e) => handleNext(e)}
                disabled={currentStep === steps.length - 1}
                rightElem={<ArrowRight />}
              >
                Next
              </Button>
            )
          }
        </div>
      </form>
    </>
  );
}
