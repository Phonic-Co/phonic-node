import type WebSocket from "ws";

export type PhonicSTSWebSocketResponseMessage =
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
      type: "error";
      error: {
        message: string;
        code?: string;
      };
      paramErrors?: {
        system_prompt?: string;
        welcome_message?: string;
        voice_id?: string;
        input_format?: string;
        output_format?: string;
      };
    };

export type OnMessageCallback = (
  message: PhonicSTSWebSocketResponseMessage,
) => void;

export type OnCloseCallback = (event: WebSocket.CloseEvent) => void;

export type OnErrorCallback = (event: WebSocket.ErrorEvent) => void;
