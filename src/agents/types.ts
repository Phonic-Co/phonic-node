import type { PhonicSTSTool } from "../sts/types";
import type { DataOrError } from "../types";

type Agent = {
  id: string;
  name: string;
  org_id: string;
  project: {
    id: string;
    name: string;
  };
  phone_number: string | null;
  voice_id: string;
  audio_format: "pcm_44100" | "mulaw_8000";
  welcome_message: string | null;
  system_prompt: string;
  template_variables: Record<string, { default_value: string | null }>;
  tools: Array<PhonicSTSTool>;
  no_input_poke_sec: number | null;
  no_input_poke_text: string;
  no_input_end_conversation_sec: number;
  boosted_keywords: string[];
  configuration_endpoint: {
    url: string;
    headers: Record<string, string>;
    timeout_ms: number;
  } | null;
};

export type ListAgentsParams = {
  project?: string;
};

export type ListAgentsSuccessResponse = DataOrError<{
  agents: Array<Agent>;
}>;

export type GetAgentParams = {
  project?: string;
};

export type GetAgentSuccessResponse = DataOrError<{
  agent: Agent;
}>;

interface AgentOptionalParams {
  project?: string;
  timezone?: string;
  voiceId?: string;
  welcomeMessage?: string;
  systemPrompt?: string;
  templateVariables?: Record<string, { defaultValue: string | null }>;
  tools?: Array<PhonicSTSTool>;
  noInputPokeSec?: number | null;
  noInputPokeText?: string;
  noInputEndConversationSec?: number;
  boostedKeywords?: string[];
  configurationEndpoint?: {
    url: string;
    headers?: Record<string, string>;
    timeoutMs?: number;
  } | null;
}

interface CreateAgentBaseParams extends AgentOptionalParams {
  name: string;
}

interface AgentPhoneNumberParams {
  phoneNumber: "assign-automatically";
  audioFormat?: "mulaw_8000";
}

interface AgentNoPhoneNumberParams {
  phoneNumber?: null;
  audioFormat?: "pcm_44100" | "mulaw_8000";
}

interface CreateAgentWithPhoneNumberParams
  extends CreateAgentBaseParams,
    AgentPhoneNumberParams {}

interface CreateAgentWithoutPhoneNumberParams
  extends CreateAgentBaseParams,
    AgentNoPhoneNumberParams {}

export type CreateAgentParams =
  | CreateAgentWithPhoneNumberParams
  | CreateAgentWithoutPhoneNumberParams;

export type CreateAgentSuccessResponse = {
  id: string;
  name: string;
};

interface UpdateAgentBaseParams extends AgentOptionalParams {
  name?: string;
}

interface UpdateAgentWithPhoneNumberParams
  extends UpdateAgentBaseParams,
    AgentPhoneNumberParams {}

interface UpdateAgentWithoutPhoneNumberParams
  extends UpdateAgentBaseParams,
    AgentNoPhoneNumberParams {}

export type UpdateAgentParams =
  | UpdateAgentWithPhoneNumberParams
  | UpdateAgentWithoutPhoneNumberParams;

export type UpdateAgentSuccessResponse = {
  success: true;
};

export type DeleteAgentParams = {
  project?: string;
};

export type DeleteAgentSuccessResponse = {
  success: true;
};
