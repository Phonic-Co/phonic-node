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

const conversationId = Bun.env.PHONIC_API_CONVERSATION_ID as string;

if (!Bun.env.PHONIC_API_CONVERSATION_ID) {
  throw new Error("PHONIC_API_CONVERSATION_ID is not set");
}

const conversationExternalId = Bun.env
  .PHONIC_API_CONVERSATION_EXTERNAL_ID as string;

// if (!Bun.env.PHONIC_API_CONVERSATION_EXTERNAL_ID) {
//   throw new Error("PHONIC_API_CONVERSATION_EXTERNAL_ID is not set");
// }

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

describe("conversations", () => {
  test("get conversation by id", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data: conversationData, error: conversationError } =
      await phonic.conversations.get(conversationId);

    if (conversationError !== null) {
      expect(conversationError).toBeNull();
      return;
    }

    const { conversation } = conversationData;

    expect(conversation.id).toBe(conversationId);
  });

  // TODO: Enable this test once we have the data in the db
  test.skip("get conversation by external id", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data: conversationData, error: conversationError } =
      await phonic.conversations.getByExternalId(conversationExternalId);

    if (conversationError !== null) {
      expect(conversationError).toBeNull();
      return;
    }

    const { conversation } = conversationData;

    expect(conversation.external_id).toBe(conversationExternalId);
  });
});

// describe.only("sts websocket", () => {
//   test(
//     "connection retries",
//     async () => {
//       const phonic = new Phonic(apiKey, { baseUrl });
//       const { data, error } = await phonic.sts.websocket({
//         input_format: "mulaw_8000",
//         system_prompt: "You are a helpful assistant.",
//         welcome_message: "Hello, how can I help you?",
//         voice_id: "meredith",
//         output_format: "mulaw_8000",
//       });

//       if (error !== null) {
//         throw new Error(`Failed to start conversation: ${error.message}`);
//       }

//       const { phonicWebSocket } = data;

//       phonicWebSocket.close();
//     },
//     8 * 60_000,
//   );
// });
