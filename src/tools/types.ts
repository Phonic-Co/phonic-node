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

interface ToolBase {
  id: string;
  name: string;
  description: string;
  type: "custom_webhook" | "custom_websocket";
  execution_mode: "sync" | "async";
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

export type ListToolsSuccessResponse = DataOrError<{
  tools: Array<Tool>;
}>;

export type GetToolSuccessResponse = DataOrError<{
  tool: Tool;
}>;

interface CreateToolParamsBase {
  name: string;
  description: string;
  type: "custom_webhook" | "custom_websocket";
  executionMode: "sync" | "async";
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
  name?: string;
  description?: string;
  type?: "custom_webhook" | "custom_websocket";
  executionMode?: "sync" | "async";
  endpointMethod?: "POST";
  endpointUrl?: string;
  endpointHeaders?: Record<string, string>;
  endpointTimeoutMs?: number;
  toolCallOutputTimeoutMs?: number;
  parameters?: ToolParameters;
};

export type UpdateToolSuccessResponse = {
  success: true;
};

export type DeleteToolSuccessResponse = {
  success: true;
};
