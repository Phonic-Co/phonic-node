import type { DataOrError } from "../types";

interface ParameterBase {
  name: string;
  description: string;
  isRequired: boolean;
}

interface PrimitiveParameter extends ParameterBase {
  type: "string" | "integer" | "number" | "boolean";
}

interface ArrayParameter extends ParameterBase {
  type: "array";
  itemType: "string" | "integer" | "number" | "boolean";
}

export type ToolParameters = Array<PrimitiveParameter | ArrayParameter>;

type ExecutionMode = "sync" | "async";

interface ToolBase {
  id: string;
  name: string;
  description: string;
  execution_mode: ExecutionMode;
  parameters: ToolParameters;
}

interface WebhookTool extends ToolBase {
  type: "custom_webhook";
  endpoint_method: "POST";
  endpoint_url: string;
  endpoint_headers: Record<string, string>;
  endpoint_timeout_ms: number;
}

interface WebSocketTool extends ToolBase {
  type: "custom_websocket";
  tool_call_output_timeout_ms: number;
}

export type Tool = WebhookTool | WebSocketTool;

export type ListToolsParams = {
  project?: string;
};

export type ListToolsSuccessResponse = DataOrError<{
  tools: Array<Tool>;
}>;

export type GetToolParams = {
  project?: string;
};

export type GetToolSuccessResponse = DataOrError<{
  tool: Tool;
}>;

interface CreateToolParamsBase {
  project?: string;
  name: string;
  description: string;
  executionMode: ExecutionMode;
  parameters?: ToolParameters;
}

interface CreateWebhookToolParams extends CreateToolParamsBase {
  type: "custom_webhook";
  endpointMethod: "POST";
  endpointUrl: string;
  endpointHeaders?: Record<string, string>;
  endpointTimeoutMs?: number;
}

interface CreateWebSocketToolParams extends CreateToolParamsBase {
  type: "custom_websocket";
  toolCallOutputTimeoutMs?: number;
}

export type CreateToolParams =
  | CreateWebhookToolParams
  | CreateWebSocketToolParams;

export type CreateToolSuccessResponse = {
  id: string;
  name: string;
};

export type UpdateToolParams = {
  project?: string;
  name?: string;
  description?: string;
  type?: "custom_webhook" | "custom_websocket";
  executionMode?: ExecutionMode;
  endpointMethod?: "POST" | null;
  endpointUrl?: string | null;
  endpointHeaders?: Record<string, string> | null;
  endpointTimeoutMs?: number | null;
  toolCallOutputTimeoutMs?: number | null;
  parameters?: ToolParameters;
};

export type UpdateToolSuccessResponse = {
  success: true;
};

export type DeleteToolParams = {
  project?: string;
};

export type DeleteToolSuccessResponse = {
  success: true;
};
