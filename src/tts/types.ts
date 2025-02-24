import type WebSocket from "ws";

export type PhonicTTSWebSocketParams = {
  model?: string;
  output_format?: string;
  voice_id?: string;
};

export type PhonicTTSWebSocketResponseMessage =
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
  | { type: "flush_confirm" }
  | { type: "stop_confirm" }
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
  message: PhonicTTSWebSocketResponseMessage,
) => void;

export type OnCloseCallback = (event: WebSocket.CloseEvent) => void;

export type OnErrorCallback = (event: WebSocket.ErrorEvent) => void;
