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

    await new Promise<void>((resolve) => {
      phonicWebSocket.onMessage((message) => {
        expect(message).toEqual({
          type: "error",
          error: {
            message: expect.any(String),
            code: "invalid_api_key",
          },
        });
        resolve();
      });
    });

    phonicWebSocket.close();
  });

  test("receive config message", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data, error } = await phonic.tts.websocket();

    if (error !== null) {
      expect(error).toBeNull();
      return;
    }

    const { phonicWebSocket } = data;

    await new Promise<void>((resolve, reject) => {
      phonicWebSocket.onMessage((message) => {
        switch (message.type) {
          case "config": {
            expect(message).toEqual({
              type: "config",
              model: expect.any(String),
              output_format: expect.any(String),
              voice_id: expect.any(String),
            });
            resolve();
            break;
          }
        }
      });
    });

    phonicWebSocket.close();
  });

  test("send text and receive all audio chunks", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data, error } = await phonic.tts.websocket();

    if (error !== null) {
      expect(error).toBeNull();
      return;
    }

    const { phonicWebSocket } = data;
    const text =
      "Good morning This is Lisa from Bright Smile Orthodontics I trust youre having a pleasant day Im reaching out because its time for your next adjustment appointment We want to ensure your treatment is progressing as planned and make any necessary tweaks to your braces We have openings available next Monday at 2 PM or Wednesday at 11 AM If those times dont suit you we can certainly find an alternative that works better for your schedule Also if youve been experiencing any discomfort or have concerns about your treatment please let us know so we can address them during your visit You can reach us at 555 456 7890 to confirm your appointment or ask any questions Thank you for choosing Bright Smile Orthodontics for your care";
    let receivedText = "";

    await new Promise<void>((resolve, reject) => {
      phonicWebSocket.onMessage((message) => {
        switch (message.type) {
          case "audio_chunk": {
            receivedText += message.text;
            break;
          }

          case "flushed": {
            if (receivedText === text) {
              resolve();
            } else {
              console.log({
                text,
                receivedText,
              });
              reject(new Error("Received text doesn't match sent text"));
            }
            break;
          }

          case "error": {
            console.error(message);
            reject(message.error.message);
            break;
          }
        }
      });

      phonicWebSocket.generate({ text });
      phonicWebSocket.flush();
    });

    phonicWebSocket.close();
  }, 30_000);

  test("send flush to force the audio generation", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data, error } = await phonic.tts.websocket();

    if (error !== null) {
      expect(error).toBeNull();
      return;
    }

    const { phonicWebSocket } = data;
    let isFlushSent = false;

    await new Promise<void>((resolve, reject) => {
      // Wait long enough to see that we don't receive any audio chunks. Then, send a flash.
      setTimeout(() => {
        phonicWebSocket.flush();
        isFlushSent = true;
      }, 10_000);

      phonicWebSocket.onMessage((message) => {
        switch (message.type) {
          case "audio_chunk": {
            if (isFlushSent) {
              expect(message.text).toBe("Hello");
              resolve();
            } else {
              reject("Received audio chunk before flush");
            }
            break;
          }

          case "error": {
            console.error(message);
            reject(message.error.message);
            break;
          }
        }
      });

      phonicWebSocket.generate({ text: "Hello" });
    });

    phonicWebSocket.close();
  }, 30_000);

  test("no more audio chunks received after stop", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data, error } = await phonic.tts.websocket({
      output_format: "mulaw_8000",
    });

    if (error !== null) {
      expect(error).toBeNull();
      return;
    }

    const { phonicWebSocket } = data;
    const text =
      "Hello This is Alex from Evergreen Lawn Care Services I hope youre enjoying the nice weather Were getting in touch because its almost time for your seasonal lawn treatment Our records show that your last fertilization and weed control application was about three months ago and wed like to schedule your next service to keep your lawn looking its best We have availability this Friday afternoon or next Tuesday morning If those times dont work for you we can find a more convenient slot Our technicians will also check for any signs of pests or disease during the visit to ensure the overall health of your lawn Please call us back at 555 234 5678 to set up your appointment or if you have any questions about our services Thank you for trusting Evergreen with your lawn care needs";
    let audioChunksReceived = 0;

    await new Promise<void>((resolve, reject) => {
      // Wait long enough to ensure that no more audio chunks arrive before finishing the test.
      setTimeout(resolve, 10_000);

      phonicWebSocket.onMessage((message) => {
        switch (message.type) {
          case "audio_chunk": {
            audioChunksReceived += 1;

            if (audioChunksReceived === 1) {
              phonicWebSocket.stop();
            } else {
              reject("Received more than 1 audio chunk");
            }
            break;
          }

          case "error": {
            console.error(message);
            reject(message.error.message);
            break;
          }
        }
      });

      phonicWebSocket.generate({ text });
      phonicWebSocket.flush();
    });

    phonicWebSocket.close();
  }, 30_000);
});
