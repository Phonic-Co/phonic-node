# Phonic Node.js SDK

Node.js library for the Phonic API.

- [Installation](#installation)
- [Setup](#setup)
- [Agents](#agents)
  - [List agents](#list-agents)
  - [Get agent](#get-agent)
  - [Create agent](#create-agent)
  - [Update agent](#update-agent)
  - [Delete agent](#delete-agent)
- [Tools](#tools)
  - [List tools](#list-tools)
  - [Get tool](#get-tool)
  - [Create tool](#create-tool)
  - [Update tool](#update-tool)
  - [Delete tool](#delete-tool)
- [Voices](#voices)
  - [List voices](#list-voices)
  - [Get voice](#get-voice)
- [Conversations](#conversations)
  - [List conversations](#list-conversations)
  - [Get conversation by id](#get-conversation-by-id)
  - [Get conversation by external id](#get-conversation-by-external-id)
- [STS outbound call](#sts-outbound-call)
- [STS outbound call using own Twilio account](#sts-outbound-call-using-own-twilio-account)
- [STS via WebSocket](#sts-via-websocket)
  - [Messages that Phonic sends back to you](#messages-that-phonic-sends-back-to-you)
- [License](#license)

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

## Agents

### List agents

```ts
const agentsResult = await phonic.agents.list({ project: "my-project" });
```

### Get agent

```ts
const agentResult = await phonic.agents.get("my-agent", { project: "my-project" });
```

### Create agent

```ts
const createAgentResult = await phonic.agents.create({
  name: "my-agent",
  
  // Optional fields
  project: "my-project", // Defaults to "main"
  phoneNumber: "assign-automatically", // Defaults to null
  timezone: "Australia/Melbourne", // Defaults to "America/Los_Angeles"
  audioFormat: "mulaw_8000", // Defaults to "pcm_44100". Must be "mulaw_8000" when `phoneNumber` is "assign-automatically"
  voiceId: "sarah", // Defaults to "grant"
  welcomeMessage: "Hello, how can I help you?", // Defaults to ""
  systemPrompt: "You are an expert in {{subject}}. Be kind to {{user_name}}.", // Defaults to "Respond in 1-2 sentences."
  templateVariables: {
    subject: {
      defaultValue: "Maths"
    },
    user_name: {
      defaultValue: null
    }
  },
  tools: ["keypad_input", "natural_conversation_ending", "my-custom-tool"], // Defaults to []
  noInputPokeSec: 30, // Defaults to null
  noInputPokeText: "Hey, are you with me?", // Defaults to "Are you still there?"
  noInputEndConversationSec: 150, // Defaults to 180
  boostedKeywords: ["Salamanca Market", "Bonorong Wildlife Sanctuary"], // Defaults to []
  configurationEndpoint: {
    url: "https://myapp.com/webhooks/phonic-config",
    headers: {
      Authorization: "Bearer 123"
    },
    timeoutMs: 10000 // Defaults to 3000
  } // Defaults to null
});
```

### Update agent

```ts
const updateAgentResult = await phonic.agents.update("my-agent", {
  name: "my-updated-agent",
  
  // Optional fields
  project: "my-project",
  phoneNumber: "assign-automatically", // or null
  timezone: "Australia/Melbourne",
  voiceId: "sarah",
  audioFormat: "mulaw_8000", // Must be "mulaw_8000" when `phoneNumber` is "assign-automatically"
  welcomeMessage: "Hello, how can I help you?",
  systemPrompt: "You are an expert in {{subject}}. Be kind to {{user_name}}.",
  templateVariables: {
    subject: {
      defaultValue: "Maths"
    },
    user_name: {
      defaultValue: null
    }
  },
  tools: ["keypad_input", "natural_conversation_ending", "my-custom-tool"],
  noInputPokeSec: 30,
  noInputPokeText: "Hey, are you with me?",
  noInputEndConversationSec: 150,
  boostedKeywords: ["Salamanca Market", "Bonorong Wildlife Sanctuary"],
  configurationEndpoint: {
    url: "https://myapp.com/webhooks/phonic-config",
    headers: {
      Authorization: "Bearer 123"
    },
    timeoutMs: 7000
  }
});
```

### Delete agent

```ts
const deleteAgentResult = await phonic.agents.delete({
  name: "my-agent",

  // Optional fields
  project: "my-project",
});
```

## Tools

### List tools

```ts
const toolsResult = await phonic.tools.list();
```

### Get tool

```ts
const toolResult = await phonic.tools.get("next_invoice");
```

### Create tool

```ts
const createToolResult = await phonic.tools.create({
  name: "next_invoice",
  description: "Returns the next invoice of the given user",
  endpointUrl: "https://myapp.com/webhooks/next-invoice",
  endpointHeaders: {
    Authorization: "Bearer 123"
  },
  endpointTimeoutMs: 20000, // Optional, defaults to 15000
  parameters: [
    {
      type: "string",
      name: "user",
      description: "Full name of the user to get the invoice for",
      isRequired: true
    },
    {
      type: "array",
      itemType: "string",
      name: "invoice_items",
      description: "List of invoice items",
      isRequired: false
    },
    {
      type: "number",
      name: "invoice_total",
      description: "Total invoice amount in USD",
      isRequired: true
    },
  ]
});
```

### Update tool

```ts
const updateToolResult = await phonic.tools.update("next_invoice", {
  name: "next_invoice_updated",
  description: "Updated description.",
  endpointUrl: "https://myapp.com/webhooks/next-invoice-updated",
  endpointHeaders: {
    Authorization: "Bearer 456"
  },
  endpointTimeoutMs: 30000,
  parameters: [
    {
      type: "string",
      name: "user",
      description: "Full name of the user to get the invoice for",
      isRequired: true
    },
    {
      type: "array",
      itemType: "string",
      name: "invoice_items",
      description: "List of invoice items",
      isRequired: true
    },
    {
      type: "number",
      name: "invoice_total",
      description: "Total invoice amount in USD",
      isRequired: true
    },
  ]
});
```

### Delete tool

```ts
const deleteToolResult = await phonic.tools.delete("next_invoice");
```


## Voices

### List voices

```ts
const voicesResult = await phonic.voices.list({ model: "merritt" });
```


### Get voice

```ts
const voiceResult = await phonic.voices.get("grant");
```

## Conversations

### List conversations

```ts
const conversationsResult = await phonic.conversations.list({
  project: "main",
  durationMin: 10, // sec
  durationMax: 20, // sec
  startedAtMin: "2025-04-17", // 00:00:00 UTC time is assumed
  startedAtMax: "2025-09-05T10:30:00.000Z",
});
```


### Get conversation by id

```ts
const conversationResult = await phonic.conversations.get("conv_b1804883-5be4-42fe-b1cf-aa84450d5c84");
```

### Get conversation by external id

```ts
const conversationResult = await phonic.conversations.getByExternalId({
  project: "main",
  externalId: "CAdb9c032c809fec7feb932ea4c96d71e1"
});
```

## STS outbound call

```ts
const { data, error } = await phonic.sts.outboundCall("+19189396241", {
  // Optional fields
  welcome_message: "Hello, how can I help you?",
  project: "main",
  system_prompt: "You are a helpful assistant.",
  voice_id: "grant",
  enable_silent_audio_fallback: true,
  vad_prebuffer_duration_ms: 1800,
  vad_min_speech_duration_ms: 40,
  vad_min_silence_duration_ms: 550,
  vad_threshold: 0.6,
  tools: ["keypad_input", "natural_conversation_ending"]
});
```

## STS outbound call using own Twilio account

In Twilio, create a restricted API key with the following permissions: `voice -> calls -> read` and `voice -> calls -> create`.

```ts
const { data, error } = await phonic.sts.twilio.outboundCall(
  {
    account_sid: "AC...",
    api_key_sid: "SK...",
    api_key_secret: "...",
    from_phone_number: "+19189372905",
    to_phone_number: "+19189396241",
  }, 
  {
    // Optional fields
    welcome_message: "Hello, how can I help you?",
    project: "main",
    system_prompt: "You are a helpful assistant.",
    voice_id: "grant",
    enable_silent_audio_fallback: true,
    vad_prebuffer_duration_ms: 1800,
    vad_min_speech_duration_ms: 40,
    vad_min_silence_duration_ms: 550,
    vad_threshold: 0.6,
    tools: ["keypad_input", "natural_conversation_ending"]
  }
);
```

## STS via WebSocket

To start a conversation, open a WebSocket connection:

```ts
const phonicWebSocket = phonic.sts.websocket({
  input_format: "mulaw_8000",

  // Optional fields
  project: "main",
  system_prompt: "You are a helpful assistant.",
  welcome_message: "Hello, how can I help you?",
  voice_id: "grant",
  output_format: "mulaw_8000",
  enable_silent_audio_fallback: true,
  vad_prebuffer_duration_ms: 1800,
  vad_min_speech_duration_ms: 40,
  vad_min_silence_duration_ms: 550,
  vad_threshold: 0.6,
  tools: ["keypad_input", "natural_conversation_ending"]
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

### Messages that Phonic sends back to you

#### `input_text`

```ts
{
  type: "input_text";
  text: string;
}
```

Phonic sends this message once user's audio is transcribed.

#### `audio_chunk`

```ts
{
  type: "audio_chunk";
  audio: string; // base64 encoded array of audio data (each value is in range [-32768..32767] for "pcm_44100" output format, and in range [0..255] for "mulaw_8000" output format)  
  text: string; // May potentially be "", but will typically be one word.
}
```

These are the assistant response audio chunks.

#### `audio_finished`

```ts
{
  type: "audio_finished";
}
```

Sent after the last "audio_chunk" is sent.

#### `interrupted_response`

```ts
{
  type: "interrupted_response",
  interruptedResponse: string, // partial assistant response that cuts off approximately where the user interrupted
}
```

Sent when the user interrupts the assistant, after the user has finished speaking.

### `assistant_ended_conversation`

```ts
{
  type: "assistant_ended_conversation";
}
```

Sent when the assistant decides to end the conversation.

## License

MIT
