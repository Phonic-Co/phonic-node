import type WebSocket from "ws";
import type {
  OnMessageCallback,
  PhonicWebSocketMessage,
  PhonicWebSocketResponseMessage,
} from "./types";

export class PhonicWebSocket {
  private onMessageCallback: OnMessageCallback | null = null;
  private streamEndedResolve: () => void = () => {};
  readonly streamEnded = new Promise<void>((resolve) => {
    this.streamEndedResolve = resolve;
  });
  private streamController: ReadableStreamDefaultController<
    PhonicWebSocketResponseMessage | Buffer
  > | null = null;

  constructor(private readonly ws: WebSocket) {
    this.ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        const dataObj = JSON.parse(
          event.data,
        ) as PhonicWebSocketResponseMessage;

        this.onMessageCallback?.(dataObj);

        if (dataObj.type === "stream-ended") {
          this.streamEndedResolve();
          this.streamController?.close();
        } else {
          this.streamController?.enqueue(dataObj);
        }
      } else if (event.data instanceof Buffer) {
        this.onMessageCallback?.(event.data);
        this.streamController?.enqueue(event.data);
      }
    };
  }

  onMessage(callback: OnMessageCallback) {
    this.onMessageCallback = callback;
  }

  send(message: PhonicWebSocketMessage) {
    const self = this;

    self.streamController?.close();

    this.ws.send(JSON.stringify(message));

    return new ReadableStream<PhonicWebSocketResponseMessage | Buffer>({
      start(controller) {
        self.streamController = controller;
      },
    });
  }

  close() {
    this.ws.close();
  }
}
