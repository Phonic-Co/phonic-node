import type WebSocket from "ws";

export type PhonicSTSConfig = {
  project: string;
  input_format: "pcm_44100" | "mulaw_8000";
  system_prompt?: string;
  welcome_message?: string;
  voice_id?: string;
  output_format?: "pcm_44100" | "mulaw_8000";
};

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
