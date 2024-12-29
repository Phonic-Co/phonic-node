import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { z } from "zod";
import { Phonic, type PhonicWebSocket } from "./index";
import type { PhonicWebSocketResponseMessage } from "./tts/types";

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
  let phonicWebSocket: PhonicWebSocket;
  let allMessages: PhonicWebSocketResponseMessage[] = [];

  const waitForMessages = async (
    count: number,
    timeout = 20_000,
  ): Promise<PhonicWebSocketResponseMessage[]> => {
    const startTime = Date.now();

    // Wait for expected count or timeout
    while (allMessages.length < count) {
      if (Date.now() - startTime > timeout) {
        throw new Error(`Timeout waiting for ${count} messages`);
      }
      await Bun.sleep(100);
    }

    // Wait a bit longer to see if we get any extra messages
    await Bun.sleep(3000);

    if (allMessages.length > count) {
      throw new Error(
        `Expected ${count} messages but received ${allMessages.length}. ` +
          `Extra messages: ${allMessages.slice(count).map((m) => `"${JSON.stringify(m).slice(0, 30)}..."`)}`,
      );
    }

    const messages = allMessages.slice(0, count);
    allMessages = allMessages.slice(count);
    return messages;
  };

  beforeEach(async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data, error } = await phonic.tts.websocket();

    if (error !== null) {
      throw new Error("Failed to connect to websocket");
    }

    phonicWebSocket = data.phonicWebSocket;
    allMessages = [];

    phonicWebSocket.onMessage((message) => {
      allMessages.push(message);
    });
  });

  afterEach(async () => {
    phonicWebSocket.close();
  });

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

  test("generate(short)-flush", async () => {
    const text = "Hello, world!";
    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();

    const messages = await waitForMessages(3);

    expect(messages[0].type).toBe("config");
    expect(messages[1].type).toBe("audio_chunk");
    expect(messages[2].type).toBe("flush_confirm");
  }, 20_000);

  test("generate(medium)-flush", async () => {
    const text =
      "In the quiet mountain town of Silverpine, Emma discovered an old wooden box " +
      "hidden beneath her grandmother's floorboards. Inside lay a tarnished locket " +
      "with a faded photograph of a young soldier and a cryptic note.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();

    const messages = await waitForMessages(4);

    expect(messages[0].type).toBe("config");
    expect(messages[1].type).toBe("audio_chunk");
    expect(messages[2].type).toBe("audio_chunk");
    expect(messages[3].type).toBe("flush_confirm");
  }, 20_000);

  test("flush with no input", async () => {
    phonicWebSocket.flush();

    const messages = await waitForMessages(2);

    expect(messages[0].type).toBe("config");
    expect(messages[1].type).toBe("flush_confirm");
  }, 20_000);

  test("stop with no input", async () => {
    phonicWebSocket.stop();

    const messages = await waitForMessages(2);

    expect(messages[0].type).toBe("config");
    expect(messages[1].type).toBe("stop_confirm");
  }, 20_000);

  test("generate-stop", async () => {
    const text =
      "This is some text that should be sent to the model server. " +
      "However, we shouldn't get back any audio chunks because " +
      "we send the stop request immediately after.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.stop();

    const messages = await waitForMessages(2);

    expect(messages[0].type).toBe("config");
    expect(messages[1].type).toBe("stop_confirm");
  }, 20_000);

  test("generate-flush-stop", async () => {
    const text =
      "This is some text that should be sent to the model server. " +
      "However, we shouldn't get back any audio chunks because " +
      "we send the stop request immediately after.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();
    phonicWebSocket.stop();

    const messages = await waitForMessages(2);

    // We don't expect a flush_confirm message because that is only sent after all audio chunks have been sent to the
    // user, which won't happen in this case because we sent the stop request.
    expect(messages[0].type).toBe("config");
    expect(messages[1].type).toBe("stop_confirm");
  }, 20_000);

  test("flush while another flush is in progress", async () => {
    const text =
      "This is some longer text and the intention is that it will take the model server a bit to process.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();
    phonicWebSocket.flush();

    const messages = await waitForMessages(4);

    expect(messages[0].type).toBe("config");
    expect(messages[1].type).toBe("error");
    expect(messages[1].error.code).toBe("flush_in_progress");
    expect(messages[2].type).toBe("audio_chunk");
    expect(messages[3].type).toBe("flush_confirm");
  }, 20_000);

  test("generate-flush and then generate-flush", async () => {
    const text1 = "This is the first generate request.";
    const text2 = "This is the second generate request.";

    phonicWebSocket.generate({ text: text1 });
    phonicWebSocket.flush();

    const messages1 = await waitForMessages(3);
    expect(messages1[0].type).toBe("config");
    expect(messages1[1].type).toBe("audio_chunk");
    // NOTE: Currently the text returned by the API is the normalized version of the input text which makes it hard to
    // do string comparison. This is why we use a substring match here.
    expect(messages1[1].text).toContain("first");
    expect(messages1[2].type).toBe("flush_confirm");

    phonicWebSocket.generate({ text: text2 });
    phonicWebSocket.flush();

    const messages2 = await waitForMessages(2);
    expect(messages2[0].type).toBe("audio_chunk");
    expect(messages2[0].text).toContain("second");
    expect(messages2[1].type).toBe("flush_confirm");
  }, 20_000);

  test("generate-flush-stop and then generate-flush", async () => {
    const text1 =
      "This is the first message that is being sent to the model server " +
      "and I am intentionally making it longer so that the stop request " +
      "will interrupt the generation.";
    const text2 = "This is the second message.";

    phonicWebSocket.generate({ text: text1 });
    phonicWebSocket.flush();
    phonicWebSocket.stop();

    const messages1 = await waitForMessages(2);

    expect(messages1[0].type).toBe("config");
    expect(messages1[1].type).toBe("stop_confirm");

    phonicWebSocket.generate({ text: text2 });
    phonicWebSocket.flush();

    const messages2 = await waitForMessages(2);

    expect(messages2[0].type).toBe("audio_chunk");
    expect(messages2[0].text).toContain("second");
    expect(messages2[1].type).toBe("flush_confirm");
  }, 20_000);

  test("generate(long)-flush", async () => {
    const text =
      "This is some really really really really really really really really really " +
      "really really really really really really really really really really really really " +
      "really really really really really really really really really really really really " +
      "really really really really really really really long sentence that doesn't have any " +
      "punctuation so that we can test out our logic with passing the context.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();

    const messages = await waitForMessages(6);

    expect(messages[0].type).toBe("config");
    expect(messages[1].type).toBe("audio_chunk");
    expect(messages[2].type).toBe("audio_chunk");
    expect(messages[3].type).toBe("audio_chunk");
    expect(messages[4].type).toBe("audio_chunk");
    expect(messages[5].type).toBe("flush_confirm");
  }, 20_000);
});
