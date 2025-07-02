import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type {
  CreateAgentParams,
  CreateAgentSuccessResponse,
  DeleteAgentParams,
  DeleteAgentSuccessResponse,
  GetAgentParams,
  GetAgentSuccessResponse,
  ListAgentParams,
  ListAgentSuccessResponse,
  UpdateAgentParams,
  UpdateAgentSuccessResponse,
} from "./types";

export class Agents {
  constructor(private readonly phonic: Phonic) {}

  private getQueryString(params?: { project?: string }) {
    const project = params?.project;
    const queryString = new URLSearchParams({
      ...(project !== undefined && { project }),
    }).toString();

    return queryString;
  }

  private getTemplateVariablesForBody(
    templateVariables: CreateAgentParams["templateVariables"],
  ) {
    if (templateVariables === undefined) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(templateVariables).map(([key, value]) => [
        key,
        {
          default_value: value.defaultValue,
        },
      ]),
    );
  }

  private getConfigurationEndpointForBody(
    configurationEndpoint: CreateAgentParams["configurationEndpoint"],
  ) {
    if (configurationEndpoint === undefined || configurationEndpoint === null) {
      return configurationEndpoint;
    }

    return {
      url: configurationEndpoint.url,
      headers: configurationEndpoint.headers,
      timeout_ms: configurationEndpoint.timeoutMs,
    };
  }

  async list(params?: ListAgentParams): DataOrError<ListAgentSuccessResponse> {
    const response = await this.phonic.get<ListAgentSuccessResponse>(
      `/agents?${this.getQueryString(params)}`,
    );

    return response;
  }

  async get(
    name: string,
    params?: GetAgentParams,
  ): DataOrError<GetAgentSuccessResponse> {
    const response = await this.phonic.get<GetAgentSuccessResponse>(
      `/agents/${name}?${this.getQueryString(params)}`,
    );

    return response;
  }

  async create(
    params: CreateAgentParams,
  ): DataOrError<CreateAgentSuccessResponse> {
    const response = await this.phonic.post<CreateAgentSuccessResponse>(
      `/agents?${this.getQueryString(params)}`,
      {
        name: params.name,
        phone_number: params.phoneNumber,
        audio_format:
          params.phoneNumber === "assign-automatically"
            ? "mulaw_8000"
            : params.audioFormat,
        voice_id: params.voiceId,
        welcome_message: params.welcomeMessage,
        system_prompt: params.systemPrompt,
        template_variables: this.getTemplateVariablesForBody(
          params.templateVariables,
        ),
        tools: params.tools,
        no_input_poke_sec: params.noInputPokeSec,
        no_input_poke_text: params.noInputPokeText,
        no_input_end_conversation_sec: params.noInputEndConversationSec,
        boosted_keywords: params.boostedKeywords,
        configuration_endpoint: this.getConfigurationEndpointForBody(
          params.configurationEndpoint,
        ),
      },
    );

    return response;
  }

  async update(
    name: string,
    params: UpdateAgentParams,
  ): DataOrError<UpdateAgentSuccessResponse> {
    const response = await this.phonic.patch<UpdateAgentSuccessResponse>(
      `/agents/${name}?${this.getQueryString(params)}`,
      {
        name: params.name,
        phone_number: params.phoneNumber,
        audio_format:
          params.phoneNumber === "assign-automatically"
            ? "mulaw_8000"
            : params.audioFormat,
        voice_id: params.voiceId,
        welcome_message: params.welcomeMessage,
        system_prompt: params.systemPrompt,
        template_variables: this.getTemplateVariablesForBody(
          params.templateVariables,
        ),
        tools: params.tools,
        no_input_poke_sec: params.noInputPokeSec,
        no_input_poke_text: params.noInputPokeText,
        no_input_end_conversation_sec: params.noInputEndConversationSec,
        boosted_keywords: params.boostedKeywords,
        configuration_endpoint: this.getConfigurationEndpointForBody(
          params.configurationEndpoint,
        ),
      },
    );

    return response;
  }

  async delete(
    name: string,
    params?: DeleteAgentParams,
  ): DataOrError<DeleteAgentSuccessResponse> {
    const response = await this.phonic.delete<DeleteAgentSuccessResponse>(
      `/agents/${name}?${this.getQueryString(params)}`,
    );

    return response;
  }
}
