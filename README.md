# Phonic Node.js SDK

Node.js library for the Phonic API.

- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
  - [Get voices](#get-voices)
  - [Get voice by id](#get-voice-by-id)
  - [Text-to-speech via WebSocket](#text-to-speech-via-websocket)

## Installation

```bash
npm i phonic
```

## Setup

Grab an API key from [Phonic settings](https://phonic.co/settings) and pass it to the Phonic constructor.

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

### Speesh-to-speech via WebSocket

Open a WebSocket connection:

```ts
const { data, error } = await phonic.sts.websocket();

if (error !== null) {
  throw new Error(error.message);
}

// Here we know that the WebSocket connection is open.
const { phonicWebSocket } = data;
```

Send config params for the conversation:

```ts
phonicWebSocket.config({
  system_prompt: "You are a helpful assistant.",
  welcome_message: "Hello, how can I help you?",
  voice_id: "meredith",
  input_format: "mulaw_8000",
  output_format: "mulaw_8000"
});
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
      ws.send(
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

### Text-to-speech via WebSocket

Open a WebSocket connection:

```ts
const { data, error } = await phonic.tts.websocket({
  model: "shasta",
  output_format: "mulaw_8000",
  voice_id: "meredith",
});

if (error !== null) {
  throw new Error(error.message);
}

// Here we know that the WebSocket connection is open.
const { phonicWebSocket } = data;
```

Process audio chunks that Phonic sends back to you, by sending them to Twilio, for example:

```ts
phonicWebSocket.onMessage((message) => {
  if (message.type === "audio_chunk") {
    ws.send(
      JSON.stringify({
        event: "media",
        streamSid: "...",
        media: {
          payload: message.audio,
        },
      }),
    );
  }
});
```

Send text chunks to Phonic for audio generation as you receive them from LLM:

```ts
const stream = await openai.chat.completions.create(...);

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content || "";

  if (text) {
    phonicWebSocket.generate({ text });
  }
}
```

Tell Phonic to finish generating audio for all text chunks you've sent:

```ts
phonicWebSocket.flush();
```

You can also tell Phonic to stop sending audio chunks back, e.g. if the user interrupts the conversation:

```ts
phonicWebSocket.stop();
```

To close the WebSocket connection:

```ts
phonicWebSocket.close();
```

To know when the last audio chunk has been received:

```ts
phonicWebSocket.onMessage((message) => {
  if (message.type === "flushed") {
    console.log("Last audio chunk received");
  }
});
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

## Publish a new version on npm

1. `bunx changeset`
2. `git add .`
3. `git commit -m "Add changeset"`
4. `git push`

This should trigger the `publish` github workflow that will create a Pull Request named "Version Packages". 
Once this Pull Request is merged, the new version will be published on npm.

## License

MIT
