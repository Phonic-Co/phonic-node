import { readFileSync } from "node:fs";
import { mulaw } from "alawmulaw";
import { config } from "dotenv";
import { decode } from "node-wav";
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
  private replayWavFilePath: string | undefined = undefined;
  private replaySampleRate: number | undefined = undefined;
  private replayChannelData: Float32Array[] | undefined = undefined;
  private replayPlaybackTime: number | undefined = undefined;

  constructor(private readonly ws: WebSocket) {
    config({ path: ".env.local" });
    this.replayWavFilePath = process.env.REPLAY_WAV_FILE_PATH;
    const buffer =
      this.replayWavFilePath !== undefined
        ? readFileSync(this.replayWavFilePath)
        : undefined;
    const result = buffer !== undefined ? decode(buffer) : undefined;
    this.replaySampleRate = result?.sampleRate;
    this.replayChannelData = result?.channelData.slice();
    this.replayPlaybackTime =
      this.replayWavFilePath !== undefined ? 0.0 : undefined;
    console.log(
      "\nreading replay wav from:",
      this.replayWavFilePath,
      "\nsample rate:",
      this.replaySampleRate,
      "\nchannels:",
      this.replayChannelData?.length,
    );
    if (
      this.replayChannelData !== undefined &&
      this.replayChannelData[0] !== undefined
    ) {
      console.log("\nlength in samples:", this.replayChannelData[0].length);
    }

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
    if (this.replayWavFilePath !== null) {
      // hijack and send replay instead
      if (
        this.replayWavFilePath !== undefined &&
        this.replayChannelData !== undefined &&
        this.replayChannelData[0] !== undefined &&
        this.replayPlaybackTime !== undefined &&
        this.replaySampleRate !== undefined
      ) {
        const audioFloat32 = this.replayChannelData[0].slice(
          this.replayPlaybackTime * this.replaySampleRate,
          (this.replayPlaybackTime + 0.02) * this.replaySampleRate,
        );
        const audioUint8MuLaw = new Uint8Array(audioFloat32.length);
        for (let i = 0; i < audioUint8MuLaw.length; i++) {
          audioUint8MuLaw[i] = mulaw.encodeSample(
            Math.floor((audioFloat32[i] ?? 0) * 32768),
          );
        }
        const audioBase64 = Buffer.from(audioUint8MuLaw.buffer).toString(
          "base64",
        );
        this.ws.send(
          JSON.stringify({
            type: "audio_chunk",
            audioBase64,
          }),
        );
      }
    } else {
      this.ws.send(
        JSON.stringify({
          type: "audio_chunk",
          audio,
        }),
      );
    }
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
