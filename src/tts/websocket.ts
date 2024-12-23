import type WebSocket from "ws";
import type {
  OnCloseCallback,
  OnErrorCallback,
  OnMessageCallback,
  PhonicWebSocketResponseMessage,
} from "./types";

export class PhonicWebSocket {
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

      const dataObj = JSON.parse(event.data) as PhonicWebSocketResponseMessage;

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

    // Make sure that `this` in these methods in the class instance,
    // regardless of how the method is called.
    this.onMessage = this.onMessage.bind(this);
    this.generate = this.generate.bind(this);
    this.flush = this.flush.bind(this);
    this.stop = this.stop.bind(this);
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

  generate(message: { text: string; speed?: number }) {
    this.ws.send(
      JSON.stringify({
        type: "generate",
        ...message,
      }),
    );
  }

  flush() {
    this.ws.send(JSON.stringify({ type: "flush" }));
  }

  stop() {
    this.ws.send(JSON.stringify({ type: "stop" }));
  }

  close() {
    this.ws.close();
  }
}
