import { describe, expect, test } from "bun:test";
import { Phonic } from "../phonic";

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

if (!Bun.env.PHONIC_API_CONVERSATION_EXTERNAL_ID) {
  throw new Error("PHONIC_API_CONVERSATION_EXTERNAL_ID is not set");
}

const baseUrl = Bun.env.PHONIC_API_BASE_URL;

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

  test("get conversation by external id", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data: conversationData, error: conversationError } =
      await phonic.conversations.getByExternalId({
        externalId: conversationExternalId,
      });

    if (conversationError !== null) {
      expect(conversationError).toBeNull();
      return;
    }

    const { conversation } = conversationData;

    expect(conversation.external_id).toBe(conversationExternalId);
  });

  test("list conversations", async () => {
    const phonic = new Phonic(apiKey, { baseUrl });
    const { data: conversationsData, error: conversationsError } =
      await phonic.conversations.list({
        durationMin: 1,
        startedAtMin: "2025-01-01",
      });

    if (conversationsError !== null) {
      expect(conversationsError).toBeNull();
      return;
    }

    const { conversations } = conversationsData;

    expect(conversations.length).toBeGreaterThan(0);
  });
});
