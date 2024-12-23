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

```js
import { Phonic } from "phonic";

const phonic = new Phonic("ph_...");
```

## Usage

### Get voices

```js
const { data, error } = await phonic.voices.list();

if (error === null) {
  console.log(data.voices);
}
```


### Get voice by id

```js
const { data, error } = await phonic.voices.get("australian-man");

if (error === null) {
  console.log(data.voice);
}
```

### Text-to-speech via WebSocket

Open a WebSocket connection:

```js
const { data, error } = await phonic.tts.websocket({
  model: "shasta",
  output_format: "mulaw_8000",
  voice_id: "australian-man",
});

if (error !== null) {
  throw new Error(error.message);
}

// Here we know that the WebSocket connection is open.
const { phonicWebSocket } = data;
```

Process audio chunks that Phonic sends back to you, by sending them to Twilio, for example:

```js
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

```js
const stream = await openai.chat.completions.create(...);

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content || "";

  if (text) {
    phonicWebSocket.generate({ text });
  }
}
```

Tell Phonic to finish generating audio for all text chunks you've sent:

```js
phonicWebSocket.flush();
```

You can also tell Phonic to stop sending audio chunks back, e.g. if the user interrupts the conversation:

```js
phonicWebSocket.stop();
```

To close the WebSocket connection:

```js
phonicWebSocket.close();
```

To know when the last audio chunk has been received:

```js
phonicWebSocket.onMessage((message) => {
  if (message.type === "flushed") {
    console.log("Last audio chunk received");
  }
});
```

You can also listen for close and error events:

```js
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
