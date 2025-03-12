# Phonic Node.js SDK

Node.js library for the Phonic API.

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
  - [Get voices](#get-voices)
  - [Get voice by id](#get-voice-by-id)
  - [Speech-to-speech via WebSocket](#speech-to-speech-via-websocket)

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


### Get voice by ID

```ts
const { data, error } = await phonic.voices.get("meredith");

if (error === null) {
  console.log(data.voice);
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
phonicWebSocket.updateSystemPrompt(
  system_prompt = "..."
)
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

## License

MIT
