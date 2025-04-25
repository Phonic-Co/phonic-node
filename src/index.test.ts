import { describe, expect, test } from "bun:test";
import { Phonic } from "./index";

describe("Phonic constructor", () => {
  test("missing API key", () => {
    expect(() => {
      // @ts-expect-error
      const phonic = new Phonic();
    }).toThrowError(/API key is missing/);
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
//         voice_id: "greta",
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
