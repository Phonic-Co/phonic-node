import type WebSocket from "ws";

export type PhonicSTSTool =
  // Built-in tools
  | "keypad_input"
  | "natural_conversation_ending"
  // Custom tools
  | (string & {}); // See: https://youtu.be/lraHlXpuhKs?si=gf5pO-_mNX4dKaoT&t=482

interface PhonicSTSConfigBase {
  input_format: "pcm_44100" | "mulaw_8000";
  output_format?: "pcm_44100" | "mulaw_8000";
  voice_id?: string;
  welcome_message?: string;
  system_prompt?: string;
  template_variables?: Record<string, string>;
  enable_silent_audio_fallback?: boolean;
  experimental_params?: Record<string, unknown>;
  tools?: Array<PhonicSTSTool>;

  // VAD configs
  vad_prebuffer_duration_ms?: number; // API default: 2000
  vad_min_speech_duration_ms?: number; // API default: 50
  vad_min_silence_duration_ms?: number; // API default: 200
  vad_threshold?: number; // API default: 0.25
}

export interface PhonicSTSConfigWithAgent extends PhonicSTSConfigBase {
  agent: string;
}

export interface PhonicSTSConfigWithProject extends PhonicSTSConfigBase {
  project: string;
}

export type PhonicSTSConfig =
  | PhonicSTSConfigWithAgent
  | PhonicSTSConfigWithProject;

export type PhonicSTSWebSocketResponseMessage =
  | {
      type: "conversation_created";
      conversation_id: string;
    }
  | {
      type: "ready_to_start_conversation";
    }
  | {
      type: "input_text";
      text: string;
    }
  | {
      type: "audio_chunk";
      text: string;
      audio: string;
    }
  | {
      type: "audio_finished";
    }
  | {
      type: "is_user_speaking";
      is_user_speaking: boolean;
    }
  | {
      type: "user_started_speaking";
    }
  | {
      type: "user_finished_speaking";
    }
  | {
      type: "interrupted_response";
      text: string;
    }
  | {
      type: "assistant_chose_not_to_respond";
    }
  | {
      type: "assistant_ended_conversation";
    }
  | {
      type: "dtmf";
      digits: string;
    }
  | {
      type: "tool_call_completed";
      id: string;
      tool: {
        id: string;
        name: string;
      };
      endpoint_url: string | null;
      endpoint_timeout_ms: number | null;
      endpoint_called_at: string | null;
      request_body: {
        call_info: {
          from_phone_number: string;
          to_phone_number: string;
        } | null;
        [key: string]: unknown;
      } | null;
      response_body: Record<string, unknown> | null;
      response_status_code: number | null;
      timed_out: boolean | null;
      error_message: string | null;
    }
  | {
      type: "tool_call";
      tool_call_id: string;
      name: string;
      parameters: Record<string, unknown>;
    }
  | {
      type: "tool_call_output";
      tool_call_id: string;
      output: unknown;
    }
  | {
      type: "error";
      error: {
        message: string;
        code?: string;
      };
      param_errors?: {
        input_format?: string;
        system_prompt?: string;
        welcome_message?: string;
        voice_id?: string;
        output_format?: string;
      };
    };

export type OnMessageCallback = (
  message: PhonicSTSWebSocketResponseMessage,
) => void;

export type OnCloseCallback = (event: WebSocket.CloseEvent) => void;

export type OnErrorCallback = (event: WebSocket.ErrorEvent) => void;

type PhonicTool = "send_dtmf_tone" | "end_conversation";

export type PhonicConfigurationEndpointRequestPayload = {
  project: {
    name: string;
  };
  agent: {
    name: string;
    welcome_message: string;
    system_prompt: string;
    tools: Array<PhonicTool>;
    boosted_keywords: string[];
  };
  from_phone_number?: string;
  to_phone_number?: string;
};

export type PhonicConfigurationEndpointResponsePayload = {
  welcome_message?: string | null;
  system_prompt?: string;
  template_variables?: Record<string, string>;
  tools?: Array<PhonicTool>;
  boosted_keywords?: string[];
};
