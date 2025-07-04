import type WebSocket from "ws";

export type PhonicSTSTool =
  // Built-in tools
  | "keypad_input"
  | "natural_conversation_ending"
  // Custom tools
  | (string & {}); // See: https://youtu.be/lraHlXpuhKs?si=gf5pO-_mNX4dKaoT&t=482

interface PhonicSTSConfigBase {
  input_format: "pcm_44100" | "mulaw_8000";
  system_prompt?: string;
  welcome_message?: string;
  voice_id?: string;
  output_format?: "pcm_44100" | "mulaw_8000";
  enable_silent_audio_fallback?: boolean;
  experimental_params?: Record<string, unknown>;
  tools?: Array<PhonicSTSTool>;

  // VAD configs
  vad_prebuffer_duration_ms?: number; // API default: 2000
  vad_min_speech_duration_ms?: number; // API default: 50
  vad_min_silence_duration_ms?: number; // API default: 200
  vad_threshold?: number; // API default: 0.25
}

interface PhonicSTSConfigWithAgent extends PhonicSTSConfigBase {
  agent: string;
}

interface PhonicSTSConfigWithProject extends PhonicSTSConfigBase {
  project: string;
}

export type PhonicSTSConfig =
  | PhonicSTSConfigWithAgent
  | PhonicSTSConfigWithProject;

export type PhonicSTSWebSocketResponseMessage =
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
      type: "is_user_speaking";
      isUserSpeaking: boolean;
    }
  | {
      type: "interrupted_response";
      interruptedResponse: string;
    }
  | {
      type: "assistant_ended_conversation";
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

export type PhonicSTSOutboundCallConfig = Omit<
  PhonicSTSConfig,
  "input_format" | "output_format"
>;

export type OutboundCallSuccessResponse = {
  success: true;
};

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
