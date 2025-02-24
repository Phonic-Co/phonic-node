import WebSocket from "ws";
import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import type { PhonicWebSocketParams } from "./types";
import { PhonicTTSWebSocket } from "./websocket";

export class TextToSpeech {
  constructor(private readonly phonic: Phonic) {}

  async websocket(
    params?: PhonicWebSocketParams,
  ): DataOrError<{ phonicWebSocket: PhonicTTSWebSocket }> {
    return new Promise((resolve) => {
      const wsBaseUrl = this.phonic.baseUrl.replace(/^http/, "ws");
      const queryString = new URLSearchParams(params).toString();
      const ws = new WebSocket(`${wsBaseUrl}/v1/tts/ws?${queryString}`, {
        headers: {
          Authorization: `Bearer ${this.phonic.apiKey}`,
        },
      });

      ws.onopen = () => {
        const phonicWebSocket = new PhonicTTSWebSocket(ws);

        resolve({ data: { phonicWebSocket }, error: null });
      };

      ws.onerror = (error) => {
        resolve({
          data: null,
          error: {
            message: error.message,
          },
        });
      };
    });
  }
}
