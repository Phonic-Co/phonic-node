import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { z } from "zod";
import { Phonic, type PhonicTTSWebSocket } from "./index";
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
    description: z.string().nullable(),
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
    const { data: voicesData, error: voicesError } = await phonic.voices.list({
      model: "shasta",
    });

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
  let phonicWebSocket: PhonicTTSWebSocket;

  /**
   * Promise that resolves with all messages received from the websocket after a period of no messages. Can be awaited
   * multiple times.
   */
  let allMessagesReceived: Promise<PhonicWebSocketResponseMessage[]> | null =
    null;
  const maxIdleTime = 5000; // If we don't receive messages for 5 seconds, we consider that we received all of them.

  const getMessages = async () => {
    if (allMessagesReceived === null) {
      throw new Error("allMessagesReceived should not be null");
    }

    const messages = await allMessagesReceived;

    return messages;
  };

  const safeGet = (messages: PhonicWebSocketResponseMessage[], idx: number) => {
    if (messages === null) {
      throw new Error("messages is null");
    }
    if (messages[idx] === undefined) {
      throw new Error(`Expected message at index ${idx} but received less`);
    }
    return messages[idx];
  };

  beforeEach(async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data, error } = await phonic.tts.websocket();

    if (error !== null) {
      throw new Error("Failed to connect to websocket");
    }

    phonicWebSocket = data.phonicWebSocket;

    let messages: PhonicWebSocketResponseMessage[] = [];
    let messagesTimeoutId: NodeJS.Timer | null = null;
    let allMessagesReceivedResolve:
      | ((messages: PhonicWebSocketResponseMessage[]) => void)
      | null = null;

    const createNewPromise = () => {
      messages = [];
      return new Promise<PhonicWebSocketResponseMessage[]>((resolve) => {
        allMessagesReceivedResolve = resolve;
      });
    };

    allMessagesReceived = createNewPromise();

    phonicWebSocket.onMessage((message) => {
      messages.push(message);

      if (messagesTimeoutId !== null) {
        clearTimeout(messagesTimeoutId);
      }

      messagesTimeoutId = setTimeout(() => {
        if (allMessagesReceivedResolve === null) {
          throw new Error("allMessagesReceivedResolve should not be null");
        }
        // Pass a copy of messages to the resolver because createNewPromise() will clear it.
        allMessagesReceivedResolve([...messages]);
        // Create a new promise for next use
        allMessagesReceived = createNewPromise();
      }, maxIdleTime);
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

    const messages = await getMessages();

    expect(messages).toHaveLength(3);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("audio_chunk");
    expect(safeGet(messages, 2).type).toBe("flush_confirm");
  }, 20_000);

  test("generate(medium)-flush", async () => {
    const text =
      "In the quiet mountain town of Silverpine, Emma discovered an old wooden box " +
      "hidden beneath her grandmother's floorboards. Inside lay a tarnished locket " +
      "with a faded photograph of a young soldier and a cryptic note.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();

    const messages = await getMessages();

    expect(messages).toHaveLength(4);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("audio_chunk");
    expect(safeGet(messages, 2).type).toBe("audio_chunk");
    expect(safeGet(messages, 3).type).toBe("flush_confirm");
  }, 20_000);

  test("generation in progress when flush is called and no text to flush (1)", async () => {
    const text =
      "You’re very welcome! I’m glad I could assist you. If you think of anything " +
      "else or need further assistance in the future, please feel free to give us " +
      "a call. Have a wonderful day, and we look forward to seeing you next week!";

    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();

    const messages = await getMessages();

    expect(messages).toHaveLength(4);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("audio_chunk");
    expect(safeGet(messages, 2).type).toBe("audio_chunk");
    expect(safeGet(messages, 3).type).toBe("flush_confirm");
  }, 20_000);

  test("generation in progress when flush is called and no text to flush (2)", async () => {
    const text =
      "One sunny afternoon, while playing near the edge of the forest, Oliver's curiosity " +
      "got the better of him. He noticed a narrow, winding path that seemed to beckon him " +
      "deeper into the woods. Ignoring the warnings of his parents and the tales of the " +
      "villagers about the enchanted forest, he decided to follow the path, thinking he would " +
      "only venture a little way in.";

    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();

    const messages = await getMessages();

    expect(messages).toHaveLength(5);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("audio_chunk");
    expect(safeGet(messages, 2).type).toBe("audio_chunk");
    expect(safeGet(messages, 3).type).toBe("audio_chunk");
    expect(safeGet(messages, 4).type).toBe("flush_confirm");
  }, 20_000);

  test("flush with no input", async () => {
    phonicWebSocket.flush();

    const messages = await getMessages();

    expect(messages).toHaveLength(2);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("flush_confirm");
  }, 20_000);

  test("stop with no input", async () => {
    phonicWebSocket.stop();

    const messages = await getMessages();

    expect(messages).toHaveLength(2);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("stop_confirm");
  }, 20_000);

  test("generate-stop", async () => {
    const text =
      "This is some text that should be sent to the model server. " +
      "However, we shouldn't get back any audio chunks because " +
      "we send the stop request immediately after.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.stop();

    const messages = await getMessages();

    expect(messages).toHaveLength(2);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("stop_confirm");
  }, 20_000);

  test("generate-flush-stop", async () => {
    const text =
      "This is some text that should be sent to the model server. " +
      "However, we shouldn't get back any audio chunks because " +
      "we send the stop request immediately after.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();
    phonicWebSocket.stop();

    const messages = await getMessages();

    // We don't expect a flush_confirm message because that is only sent after all audio chunks have been sent to the
    // user, which won't happen in this case because we sent the stop request.
    expect(messages).toHaveLength(2);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("stop_confirm");
  }, 20_000);

  test("flush while another flush is in progress", async () => {
    const text =
      "This is some longer text and the intention is that it will take the model server a bit to process.";
    phonicWebSocket.generate({ text });
    phonicWebSocket.flush();
    phonicWebSocket.flush();

    const messages = await getMessages();

    expect(messages).toHaveLength(4);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1)).toEqual({
      type: "error",
      error: {
        message: expect.any(String),
        code: "flush_in_progress",
      },
    });
    expect(safeGet(messages, 2).type).toBe("audio_chunk");
    expect(safeGet(messages, 3).type).toBe("flush_confirm");
  }, 20_000);

  test("generate-flush and then generate-flush", async () => {
    const text1 = "This is the first generate request.";
    const text2 = "This is the second generate request.";

    phonicWebSocket.generate({ text: text1 });
    phonicWebSocket.flush();

    const messages1 = await getMessages();
    expect(messages1).toHaveLength(3);
    expect(safeGet(messages1, 0).type).toBe("config");
    // NOTE: Currently the text returned by the API is the normalized version of the input text which makes it hard to
    // do string comparison. This is why we use a substring match here.
    expect(safeGet(messages1, 1)).toMatchObject({
      type: "audio_chunk",
      text: expect.stringContaining("first"),
      audio: expect.any(String),
    });
    expect(safeGet(messages1, 2).type).toBe("flush_confirm");

    phonicWebSocket.generate({ text: text2 });
    phonicWebSocket.flush();

    const messages2 = await getMessages();
    expect(messages2).toHaveLength(2);
    expect(safeGet(messages2, 0)).toMatchObject({
      type: "audio_chunk",
      text: expect.stringContaining("second"),
      audio: expect.any(String),
    });
    expect(safeGet(messages2, 1).type).toBe("flush_confirm");
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

    const messages1 = await getMessages();

    expect(messages1).toHaveLength(2);
    expect(safeGet(messages1, 0).type).toBe("config");
    expect(safeGet(messages1, 1).type).toBe("stop_confirm");

    phonicWebSocket.generate({ text: text2 });
    phonicWebSocket.flush();

    const messages2 = await getMessages();

    expect(messages2).toHaveLength(2);
    expect(safeGet(messages2, 0)).toMatchObject({
      type: "audio_chunk",
      text: expect.stringContaining("second"),
      audio: expect.any(String),
    });
    expect(safeGet(messages2, 1).type).toBe("flush_confirm");
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

    const messages = await getMessages();

    expect(messages).toHaveLength(6);
    expect(safeGet(messages, 0).type).toBe("config");
    expect(safeGet(messages, 1).type).toBe("audio_chunk");
    expect(safeGet(messages, 2).type).toBe("audio_chunk");
    expect(safeGet(messages, 3).type).toBe("audio_chunk");
    expect(safeGet(messages, 4).type).toBe("audio_chunk");
    expect(safeGet(messages, 5).type).toBe("flush_confirm");
  }, 20_000);
});
