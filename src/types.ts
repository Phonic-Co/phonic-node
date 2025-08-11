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

type ConversationItem =
  | {
      role: "user";
      item_idx: number;
      text: string;
      duration_ms: number;
      started_at: string;
    }
  | {
      role: "assistant";
      item_idx: number;
      text: string;
      voice_id: string;
      system_prompt: string;
      audio_speed: number;
      duration_ms: number;
      started_at: string;
    };

export type Conversation = {
  id: string;
  external_id: string | null;
  workspace: string;
  agent: {
    id: string;
    name: string;
  } | null;
  model: string;
  welcome_message: string | null;
  input_format: "pcm_44100" | "mulaw_8000";
  output_format: "pcm_44100" | "mulaw_8000";
  live_transcript: string;
  post_call_transcript: string | null;
  audio_url: string | null;
  duration_ms: number;
  task_results: TaskResults;
  started_at: ISODateTime;
  ended_at: ISODateTime | null;
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
