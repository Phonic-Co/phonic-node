import { describe, expect, test } from "bun:test";
import { z } from "zod";
import { Phonic } from "./index";

const apiKey = Bun.env.PHONIC_API_KEY;

if (!apiKey) {
  throw new Error("PHONIC_API_KEY is not set");
}

if (!Bun.env.PHONIC_API_BASE_URL) {
  throw new Error("PHONIC_API_BASE_URL is not set");
}

const baseUrl = Bun.env.PHONIC_API_BASE_URL;

const voiceSchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .strict();

describe("Phonic constructor", () => {
  test("missing API key", () => {
    expect(() => {
      // @ts-expect-error
      const phonic = new Phonic();
    }).toThrowError(/API key is missing/);
  });
});

describe("voices", () => {
  test("list voices and get voice by id", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data: voicesData, error: voicesError } = await phonic.voices.list();

    if (voicesError !== null) {
      expect(voicesError).toBeNull();
      return;
    }

    for (const voice of voicesData.voices) {
      expect(voiceSchema.safeParse(voice).success).toBe(true);
    }

    const voiceId = voicesData.voices[0]?.id;

    if (!voiceId) {
      throw new Error("No voices found");
    }

    const { data: voiceData, error: voiceError } =
      await phonic.voices.get(voiceId);

    if (voiceError !== null) {
      expect(voiceError).toBeNull();
      return;
    }

    expect(voiceSchema.safeParse(voiceData.voice).success).toBe(true);
  });
});

describe("tts.websocket", () => {
  test("can't connect to websocket", async () => {
    const phonic = new Phonic(apiKey, {
      baseUrl: baseUrl.replace("://", "://invalid"),
    });
    const { data, error } = await phonic.tts.websocket();

    if (data !== null) {
      expect(data).toBeNull();
      return;
    }

    expect(error.message).toMatch(/failed to connect/i);
  });

  test("invalid api key", async () => {
    const phonic = new Phonic(`${apiKey}_invalid`, { baseUrl });
    const { data, error } = await phonic.tts.websocket();

    if (error !== null) {
      expect(error).toBeNull();
      return;
    }

    const { phonicWebSocket } = data;

    phonicWebSocket.onMessage((data) => {
      if (data instanceof Buffer) {
        expect(data instanceof Buffer).toBe(false);
      } else {
        if (data.type !== "stream-ended") {
          throw new Error(`Expected to get a "stream-ended" message`);
        }

        expect(data.error?.code).toBe("invalid_api_key");
      }
    });

    await phonicWebSocket.streamEnded;

    phonicWebSocket.close();
  });

  test("blocking using stream", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data, error } = await phonic.tts.websocket();

    if (error !== null) {
      expect(error).toBeNull();
      return;
    }

    const { phonicWebSocket } = data;
    const stream = phonicWebSocket.send({
      script: "Hello! You've reached Phonic. How can I help you today?",
      output_format: "pcm_44100",
    });

    for await (const data of stream) {
      if (!(data instanceof Buffer)) {
        expect(data.type).toBe("stream-ended");
      }
    }

    phonicWebSocket.close();
  }, 30000);

  test("non-blocking using onMessage", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data, error } = await phonic.tts.websocket();

    if (error !== null) {
      expect(error).toBeNull();
      return;
    }

    const { phonicWebSocket } = data;

    phonicWebSocket.onMessage((data) => {
      if (!(data instanceof Buffer)) {
        expect(data.type).toBe("stream-ended");
      }
    });

    phonicWebSocket.send({
      script: "Hello! You've reached Phonic. How can I help you today?",
      output_format: "mulaw_8000",
    });

    await phonicWebSocket.streamEnded;

    phonicWebSocket.close();
  }, 30000);
});
