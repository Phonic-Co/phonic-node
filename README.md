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

```js
const { data, error } = await phonic.tts.websocket();

if (error === null) {
  const { phonicWebSocket } = data;
  const stream = phonicWebSocket.send({
    script: "How can I help you today?", // 600 characters max
    output_format: "mulaw_8000", // or "pcm_44100"
  });

  for await (const data of stream) {
    if (data instanceof Buffer) {
      // Do something with the audio chunk,
      // e.g. send `data.toString("base64")` to Twilio.
    }
  }

  phonicWebSocket.close();
}
```

To perform other work while receiving chunks, use:

```js
phonicWebSocket.onMessage((data) => {
  if (data instanceof Buffer) {
    // Do something with the audio chunk,
    // e.g. send `data.toString("base64")` to Twilio.
  }
});

phonicWebSocket.send({
  script: "How can I help you today?",
  output_format: "mulaw_8000",
});

// Perform other work here

await phonicWebSocket.streamEnded; // This Promise will be resolved once the last chunk is received
```


## License

MIT
