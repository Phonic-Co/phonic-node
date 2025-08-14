export type PhonicConfig = {
  baseUrl?: string;
  headers?: Record<string, string>; // Optional request headers for all requests
  __downstreamWebSocketUrl?: string; // Intented for internal use only
};

export type FetchOptions =
  | {
      method: "GET";
      headers?: Record<string, string>;
    }
  | {
      method: "POST";
      headers?: Record<string, string>;
      body: string;
    }
  | {
      method: "PATCH";
      headers?: Record<string, string>;
      body: string;
    }
  | {
      method: "PUT";
      headers?: Record<string, string>;
      body: string;
    }
  | {
      method: "DELETE";
      headers?: Record<string, string>;
    };

export type DataOrError<T> = Promise<
  | { data: T; error: null }
  | {
      data: null;
      error: {
        message: string;
        code?: string;
        param_errors?: Record<string, string>;
      };
    }
>;

export type ISODate = `${string}-${string}-${string}`;
export type ISODateTime = `${string}Z`;

type TaskStatus = "pending" | "completed" | "failed";

type TaskResult = {
  name: string;
  description: string;
  status: TaskStatus;
  commentary: string | null;
};

type TaskResults = {
  results: Array<TaskResult>;
};

type ToolCall = {
  id: string;
  tool: {
    id: string;
    name: string;
  };
  endpoint_url: string | null;
  endpoint_headers: Record<string, string> | null;
  endpoint_timeout_ms: number | null;
  endpoint_called_at: string | null;
  request_body: Record<string, unknown> | null;
  response_body: Record<string, unknown> | null;
  response_status_code: number | null;
  timed_out: boolean | null;
  error_message: string | null;
};

type ConversationItem =
  | {
      item_idx: number;
      role: "user";
      live_transcript: string;
      post_call_transcript: string | null;
      duration_ms: number;
      started_at: string;
    }
  | {
      item_idx: number;
      role: "assistant";
      live_transcript: string;
      voice_id: string;
      system_prompt: string;
      audio_speed: number;
      duration_ms: number;
      started_at: string;
      tool_calls: Array<ToolCall>;
    };

export type Conversation = {
  id: string;
  agent: {
    id: string;
    name: string;
    is_deleted: boolean;
  } | null;
  workspace: string;
  project: {
    id: string;
    name: string;
  };
  external_id: string | null;
  model: string;
  welcome_message: string | null;
  template_variables: Record<string, string>;
  input_format: "pcm_44100" | "mulaw_8000";
  output_format: "pcm_44100" | "mulaw_8000";
  live_transcript: string;
  post_call_transcript: string | null;
  duration_ms: number;
  audio_url: string | null;
  started_at: ISODateTime;
  ended_at: ISODateTime | null;
  task_results: TaskResults;
  items: Array<ConversationItem>;
};

export type ConversationEndedWebhookPayload = {
  event_type: "conversation.ended";
  created_at: ISODateTime;
  data: {
    conversation: Conversation;
    call_info: {
      from_phone_number: string;
      to_phone_number: string;
    } | null;
  };
};

export type ConversationAnalysisWebhookPayload = {
  event_type: "conversation.analysis";
  created_at: ISODateTime;
  data: {
    conversation: {
      latencies_ms: number[];
      interruptions_count: number;
    };
    call_info: {
      from_phone_number: string;
      to_phone_number: string;
    } | null;
  };
};
