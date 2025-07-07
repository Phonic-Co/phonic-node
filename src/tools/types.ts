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

type Tool = {
  id: string;
  name: string;
  description: string;
  endpoint_url: string;
  endpoint_headers: Record<string, string>;
  endpoint_timeout_ms: number;
  parameters: ToolParameters;
};

export type ListToolsSuccessResponse = DataOrError<{
  tools: Array<Tool>;
}>;

export type GetToolSuccessResponse = DataOrError<{
  tool: Tool;
}>;

export type CreateToolParams = {
  name: string;
  description: string;
  endpointUrl: string;
  endpointHeaders?: Record<string, string>;
  endpointTimeoutMs?: number;
  parameters?: ToolParameters;
};

export type CreateToolSuccessResponse = {
  id: string;
  name: string;
};

export type UpdateToolParams = {
  name?: string;
  description?: string;
  endpointUrl?: string;
  endpointHeaders?: Record<string, string>;
  endpointTimeoutMs?: number;
  parameters?: Array<PrimitiveParameter | ArrayParameter>;
};

export type UpdateToolSuccessResponse = {
  success: true;
};

export type DeleteToolSuccessResponse = {
  success: true;
};
