import WebSocket from "ws";
import type { Phonic } from "../phonic";
import type { DataOrError } from "../types";
import { PhonicWebSocket } from "./websocket";

export class TextToSpeech {
  constructor(private readonly phonic: Phonic) {}

  async websocket(): DataOrError<{ phonicWebSocket: PhonicWebSocket }> {
    return new Promise((resolve) => {
      const wsBaseUrl = this.phonic.baseUrl.replace(/^http/, "ws");
      const ws = new WebSocket(`${wsBaseUrl}/v1/generate/audio/ws`, {
        headers: {
          Authorization: `Bearer ${this.phonic.apiKey}`,
        },
      });

      ws.onopen = () => {
        const phonicWebSocket = new PhonicWebSocket(ws);

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
