import type WebSocket from "ws";
import type {
  OnCloseCallback,
  OnErrorCallback,
  OnMessageCallback,
  PhonicSTSConfig,
  PhonicSTSWebSocketResponseMessage,
} from "./types";

export class PhonicSTSWebSocket {
  private onMessageCallback: OnMessageCallback | null = null;
  private onCloseCallback: OnCloseCallback | null = null;
  private onErrorCallback: OnErrorCallback | null = null;
  private buffer: Array<string> = [];
  private isOpen = false;

  constructor(
    private readonly ws: WebSocket,
    private readonly config: PhonicSTSConfig,
  ) {
    this.buffer.push(
      JSON.stringify({
        type: "config",
        ...this.config,
      }),
    );

    this.ws.onopen = () => {
      for (const message of this.buffer) {
        this.ws.send(message);
      }

      this.isOpen = true;
    };

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
    const audiochunkMessage = JSON.stringify({
      type: "audio_chunk",
      audio,
    });

    if (this.isOpen) {
      this.ws.send(audiochunkMessage);
    } else {
      this.buffer.push(audiochunkMessage);
    }
  }

  sendToolCallOutput({
    toolCallId,
    output,
  }: {
    toolCallId: string;
    output: unknown;
  }) {
    const toolCallOutputMessage = JSON.stringify({
      type: "tool_call_output",
      tool_call_id: toolCallId,
      output,
    });

    if (this.isOpen) {
      this.ws.send(toolCallOutputMessage);
    } else {
      this.buffer.push(toolCallOutputMessage);
    }
  }

  updateSystemPrompt({ systemPrompt }: { systemPrompt: string }) {
    const updateSystemPromptMessage = JSON.stringify({
      type: "update_system_prompt",
      system_prompt: systemPrompt,
    });

    if (this.isOpen) {
      this.ws.send(updateSystemPromptMessage);
    } else {
      this.buffer.push(updateSystemPromptMessage);
    }
  }

  setExternalId({ externalId }: { externalId: string }) {
    const setExternalIdMessage = JSON.stringify({
      type: "set_external_id",
      external_id: externalId,
    });

    if (this.isOpen) {
      this.ws.send(setExternalIdMessage);
    } else {
      this.buffer.push(setExternalIdMessage);
    }
  }

  close(code?: number) {
    this.ws.close(code ?? 1000);
  }
}
