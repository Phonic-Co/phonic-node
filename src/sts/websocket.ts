import type WebSocket from "ws";
import type {
  OnCloseCallback,
  OnErrorCallback,
  OnMessageCallback,
  PhonicSTSWebSocketResponseMessage,
} from "./types";

export class PhonicSTSWebSocket {
  private onMessageCallback: OnMessageCallback | null = null;
  private onCloseCallback: OnCloseCallback | null = null;
  private onErrorCallback: OnErrorCallback | null = null;

  constructor(private readonly ws: WebSocket) {
    this.ws.onmessage = (event) => {
      if (this.onMessageCallback === null) {
        return;
      }

      if (typeof event.data !== "string") {
        throw new Error("Received non-string message");
      }

      const dataObj = JSON.parse(
        event.data,
      ) as PhonicSTSWebSocketResponseMessage;

      this.onMessageCallback(dataObj);
    };

    this.ws.onclose = (event) => {
      if (this.onCloseCallback === null) {
        return;
      }

      this.onCloseCallback(event);
    };

    this.ws.onerror = (event) => {
      if (this.onErrorCallback === null) {
        return;
      }

      this.onErrorCallback(event);
    };

    // Make sure that `this` in these methods is the class instance,
    // regardless of how the method is called.
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onError = this.onError.bind(this);
    this.audioChunk = this.audioChunk.bind(this);
    this.close = this.close.bind(this);
  }

  onMessage(callback: OnMessageCallback) {
    this.onMessageCallback = callback;
  }

  onClose(callback: OnCloseCallback) {
    this.onCloseCallback = callback;
  }

  onError(callback: OnErrorCallback) {
    this.onErrorCallback = callback;
  }

  audioChunk({ audio }: { audio: string }) {
    this.ws.send(
      JSON.stringify({
        type: "audio_chunk",
        audio,
      }),
    );
  }

  updateSystemPrompt({ systemPrompt }: { systemPrompt: string }) {
    this.ws.send(
      JSON.stringify({
        type: "update_system_prompt",
        system_prompt: systemPrompt,
      }),
    );
  }

  setExternalId({ externalId }: { externalId: string }) {
    this.ws.send(
      JSON.stringify({
        type: "set_external_id",
        external_id: externalId,
      }),
    );
  }

  close(code?: number) {
    this.ws.close(code ?? 1000);
  }
}
