import { describe, expect, test } from "bun:test";
import { z } from "zod";
import { Phonic } from "../phonic";

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

describe("voices", () => {
  test("list voices and get voice by id", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data: voicesData, error: voicesError } = await phonic.voices.list({
      model: "tahoe",
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
