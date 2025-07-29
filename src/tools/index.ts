import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type {
  CreateToolParams,
  CreateToolSuccessResponse,
  DeleteToolParams,
  DeleteToolSuccessResponse,
  GetToolParams,
  GetToolSuccessResponse,
  ListToolsParams,
  ListToolsSuccessResponse,
  ToolParameters,
  UpdateToolParams,
  UpdateToolSuccessResponse,
} from "./types";

export class Tools {
  constructor(private readonly phonic: Phonic) {}

  private getQueryString(params?: { project?: string }) {
    const project = params?.project;
    const queryString = new URLSearchParams({
      ...(project !== undefined && { project }),
    }).toString();

    return queryString;
  }

  private getParametersForBody(parameters: ToolParameters | undefined) {
    if (parameters === undefined) {
      return undefined;
    }

    return parameters.map((parameter) => {
      return {
        type: parameter.type,
        name: parameter.name,
        description: parameter.description,
        is_required: parameter.isRequired,
        ...(parameter.type === "array" && {
          item_type: parameter.itemType,
        }),
      };
    });
  }

  async list(params?: ListToolsParams): DataOrError<ListToolsSuccessResponse> {
    const response = await this.phonic.get<ListToolsSuccessResponse>(
      `/tools?${this.getQueryString(params)}`,
    );

    return response;
  }

  async get(
    nameOrId: string,
    params?: GetToolParams,
  ): DataOrError<GetToolSuccessResponse> {
    const response = await this.phonic.get<GetToolSuccessResponse>(
      `/tools/${nameOrId}?${this.getQueryString(params)}`,
    );

    return response;
  }

  async create(
    params: CreateToolParams,
  ): DataOrError<CreateToolSuccessResponse> {
    const body: Record<string, unknown> = {
      name: params.name,
      description: params.description,
      type: params.type,
      execution_mode: params.executionMode,
      parameters: this.getParametersForBody(params.parameters),
    };

    if (params.type === "custom_webhook") {
      body.endpoint_method = params.endpointMethod;
      body.endpoint_url = params.endpointUrl;
      body.endpoint_headers = params.endpointHeaders;
      body.endpoint_timeout_ms = params.endpointTimeoutMs;
    }

    if (params.type === "custom_websocket") {
      body.tool_call_output_timeout_ms = params.toolCallOutputTimeoutMs;
    }

    const response = await this.phonic.post<CreateToolSuccessResponse>(
      `/tools?${this.getQueryString(params)}`,
      body,
    );

    return response;
  }

  async update(
    nameOrId: string,
    params: UpdateToolParams,
  ): DataOrError<UpdateToolSuccessResponse> {
    const response = await this.phonic.patch<UpdateToolSuccessResponse>(
      `/tools/${nameOrId}?${this.getQueryString(params)}`,
      {
        name: params.name,
        description: params.description,
        type: params.type,
        execution_mode: params.executionMode,
        endpoint_method: params.endpointMethod,
        endpoint_url: params.endpointUrl,
        endpoint_headers: params.endpointHeaders,
        endpoint_timeout_ms: params.endpointTimeoutMs,
        parameters: this.getParametersForBody(params.parameters),
        tool_call_output_timeout_ms: params.toolCallOutputTimeoutMs,
      },
    );

    return response;
  }

  async delete(
    nameOrId: string,
    params?: DeleteToolParams,
  ): DataOrError<DeleteToolSuccessResponse> {
    const response = await this.phonic.delete<DeleteToolSuccessResponse>(
      `/tools/${nameOrId}?${this.getQueryString(params)}`,
    );

    return response;
  }
}
