import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type {
  CreateToolParams,
  CreateToolSuccessResponse,
  DeleteToolSuccessResponse,
  GetToolSuccessResponse,
  ListToolsSuccessResponse,
  ToolParameters,
  UpdateToolParams,
  UpdateToolSuccessResponse,
} from "./types";

export class Tools {
  constructor(private readonly phonic: Phonic) {}

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

  async list(): DataOrError<ListToolsSuccessResponse> {
    const response = await this.phonic.get<ListToolsSuccessResponse>("/tools");

    return response;
  }

  async get(name: string): DataOrError<GetToolSuccessResponse> {
    const response = await this.phonic.get<GetToolSuccessResponse>(
      `/tools/${name}`,
    );

    return response;
  }

  async create(
    params: CreateToolParams,
  ): DataOrError<CreateToolSuccessResponse> {
    const response = await this.phonic.post<CreateToolSuccessResponse>(
      "/tools",
      {
        name: params.name,
        description: params.description,
        endpoint_method: params.endpointMethod,
        endpoint_url: params.endpointUrl,
        endpoint_headers: params.endpointHeaders,
        endpoint_timeout_ms: params.endpointTimeoutMs,
        parameters: this.getParametersForBody(params.parameters),
      },
    );

    return response;
  }

  async update(
    name: string,
    params: UpdateToolParams,
  ): DataOrError<UpdateToolSuccessResponse> {
    const response = await this.phonic.patch<UpdateToolSuccessResponse>(
      `/tools/${name}`,
      {
        name: params.name,
        description: params.description,
        endpoint_method: params.endpointMethod,
        endpoint_url: params.endpointUrl,
        endpoint_headers: params.endpointHeaders,
        endpoint_timeout_ms: params.endpointTimeoutMs,
        parameters: this.getParametersForBody(params.parameters),
      },
    );

    return response;
  }

  async delete(name: string): DataOrError<DeleteToolSuccessResponse> {
    const response = await this.phonic.delete<DeleteToolSuccessResponse>(
      `/tools/${name}`,
    );

    return response;
  }
}
