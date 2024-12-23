import type WebSocket from "ws";

export type PhonicWebSocketParams = {
  model?: string;
  output_format?: string;
  voice_id?: string;
};

export type PhonicWebSocketResponseMessage =
  | {
      type: "config";
      model: string;
      output_format: string;
      voice_id: string;
    }
  | {
      type: "audio_chunk";
      audio: string;
      text: string;
    }
  | { type: "flushed" }
  | {
      type: "error";
      error: {
        message: string;
        code?: string;
      };
      paramErrors?: {
        model?: string;
        output_format?: string;
        voice_id?: string;
        text?: string;
        speed?: string;
      };
    };

export type OnMessageCallback = (
  message: PhonicWebSocketResponseMessage,
) => void;

export type OnCloseCallback = (event: WebSocket.CloseEvent) => void;

export type OnErrorCallback = (event: WebSocket.ErrorEvent) => void;
