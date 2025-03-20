# Phonic Node.js SDK

Node.js library for the Phonic API.

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
  - [Get voices](#get-voices)
  - [Get voice by id](#get-voice-by-id)
  - [Get conversation by id](#get-conversation-by-id)
  - [Get conversation by external id](#get-conversation-by-external-id)
  - [List conversations](#list-conversations)
  - [Speech-to-speech via WebSocket](#speech-to-speech-via-websocket)
    - [Messages that Phonic sends back to you](#messages-that-phonic-sends-back-to-you)

## Installation

```bash
npm i phonic
```

## Setup

Grab an API key from the [Phonic API Keys](https://phonic.co/api-keys) section and pass it to the Phonic constructor.

```ts
import { Phonic } from "phonic";

const phonic = new Phonic("ph_...");
```

## Usage

### Get voices

```ts
const { data, error } = await phonic.voices.list({ model: "shasta" });

if (error === null) {
  console.log(data.voices);
}
```


### Get voice by id

```ts
const { data, error } = await phonic.voices.get("meredith");

if (error === null) {
  console.log(data.voice);
}
```

### Get conversation by id

```ts
const { data, error } = await phonic.conversations.get("conv_b1804883-5be4-42fe-b1cf-aa84450d5c84");

if (error === null) {
  console.log(data.conversation);
}
```

### Get conversation by external id

```ts
const { data, error } = await phonic.conversations.getByExternalId("CAdb9c032c809fec7feb932ea4c96d71e1");

if (error === null) {
  console.log(data.conversation);
}
```

### List conversations

```ts
const { data, error } = await phonic.conversations.list({
  durationMin: 10, // sec
  durationMax: 20, // sec
  startedAtMin: "2025-04-17", // 00:00:00 UTC time is assumed
  startedAtMax: "2025-09-05T10:30:00.000Z",
});

if (error === null) {
  console.log(data.conversations);
}
```

### Speech-to-speech via WebSocket

To start a conversation, open a WebSocket connection:

```ts
const { data, error } = await phonic.sts.websocket({
  input_format: "mulaw_8000",

  // Optional fields
  system_prompt: "You are a helpful assistant.",
  welcome_message: "Hello, how can I help you?",
  voice_id: "meredith",
  output_format: "mulaw_8000"
});

if (error !== null) {
  throw new Error(`Failed to start conversation: ${error.message}`);
}

const { phonicWebSocket } = data;
```

Stream input (user) audio chunks:

```ts
phonicWebSocket.audioChunk({
  audio: "...", // base64 encoded audio chunk
});
```

Process messages that Phonic sends back to you:

```ts
phonicWebSocket.onMessage((message) => {
  switch (message.type) {
    case "input_text": {
      console.log(`User: ${message.text}`);
      break;
    }

    case "audio_chunk": {
      // Send the audio chunk to Twilio, for example:
      twilioWebSocket.send(
        JSON.stringify({
          event: "media",
          streamSid: "...",
          media: {
            payload: message.audio,
          },
        }),
      );
      break;
    }
  }
});
```

Update the system prompt mid-conversation:

```ts
phonicWebSocket.updateSystemPrompt({
  systemPrompt: "..."
})
```

Set an external id for the conversation (can be the Twilio Call SID, for example):

```ts
phonicWebSocket.setExternalId({
  externalId: "..."
})
```

To end the conversation, close the WebSocket:

```ts
phonicWebSocket.close();
```

You can also listen for close and error events:

```ts
phonicWebSocket.onClose((event) => {
  console.log(
    `Phonic WebSocket closed with code ${event.code} and reason "${event.reason}"`,
  );
});

phonicWebSocket.onError((event) => {
  console.log(`Error from Phonic WebSocket: ${event.message}`);
});
```

#### Messages that Phonic sends back to you

##### `input_text`

```ts
{
  type: "input_text";
  text: string;
}
```

Phonic sends this message once user's audio is transcribed.

##### `audio_chunk`

```ts
{
  type: "audio_chunk";
  audio: string; // base64 encoded array of audio data (each value is in range [-32768..32767] for "pcm_44100" output format, and in range [0..255] for "mulaw_8000" output format)  
  text: string; // May potentially be "", but will typically be one word.
}
```

These are the assistant response audio chunks.

##### `audio_finished`

```ts
{
  type: "audio_finished";
}
```

Sent after the last "audio_chunk" is sent.

##### `interrupted_response`

```ts
{
  type: "interrupted_response",
  interruptedResponse: string, // partial assistant response that cuts off approximately where the user interrupted
}
```

Sent when the user interrupts the assistant, after the user has finished speaking.

## License

MIT
