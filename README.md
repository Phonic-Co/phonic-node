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
  - [Outbound call](#outbound-call)
  - [Outbound call using own Twilio account](#outbound-call-using-own-twilio-account)
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
const agentsResult = await phonic.agents.list({ project: "main" });
```

### Get agent

```ts
const agentResult = await phonic.agents.get("chris", { project: "main" });
```

### Create agent

```ts
const createAgentResult = await phonic.agents.create({
  name: "chris",
  
  // Optional fields
  project: "main", // Defaults to "main"
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
const updateAgentResult = await phonic.agents.update("chris", {
  name: "chris",
  
  // Optional fields
  project: "main",
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
  name: "chris",
  // Optional fields
  project: "main",
});
```

## Tools

### List tools

```ts
const toolsResult = await phonic.tools.list();
```

### Get tool

Gets a tool by its ID or name.

```ts
const toolResult = await phonic.tools.get("next_invoice");
const toolByIdResult = await phonic.tools.get("tool_12cf6e88-c254-4d3e-a149-ddf1bdd2254c");
```

### Create tool

Tools can be either webhook-based (HTTP endpoints) or WebSocket-based.

#### Create webhook tool

```ts
const createWebhookToolResult = await phonic.tools.create({
  name: "next_invoice",
  description: "Returns the next invoice of the given user",
  type: "custom_webhook",
  executionMode: "sync",
  endpointMethod: "POST",
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

#### Create WebSocket tool

WebSocket tools allow you to handle tool execution through the WebSocket connection. When the agent calls a WebSocket tool, you'll receive a `tool_call` message and must respond with a `tool_call_output` message that contains the tool result.

```ts
const createWebSocketToolResult = await phonic.tools.create({
  name: "get_product_recommendations",
  description: "Gets personalized product recommendations",
  type: "custom_websocket",
  executionMode: "async",
  toolCallOutputTimeoutMs: 5000, // Optional, defaults to 15000
  parameters: [
    {
      type: "string",
      name: "category",
      description: "Product category (e.g., 'handbags', 'shoes', 'electronics')",
      isRequired: true
    }
  ]
});
```

To use this tool in a conversation, add it to your agent or config:

```ts
// When creating an agent
const agent = await phonic.agents.create({
  name: "shopping-assistant",
  tools: ["get_product_recommendations"],
  // ... other config
});

// Or, override agent settings when starting a WebSocket conversation
const phonicWebSocket = phonic.sts.websocket({
  name: "shopping-assistant",
  tools: ["get_product_recommendations"],
  // ... other config
});

// Handle the tool call when it's invoked
phonicWebSocket.onMessage(async (message) => {
  if (message.type === "tool_call" && message.name === "get_product_recommendations") {
    const category = message.parameters.category;
    
    // Execute your business logic
    const recommendations = fetchRecommendations(category);
    
    // Send the result back
    phonicWebSocket.[sendToolCallOutput](#send-tool-output-to-phonic)({
      toolCallId: message.tool_call_id,
      output: {
        products: recommendations,
        total: recommendations.length
      }
    });
  }
});
```

### Update tool

Updates a tool by ID or name. All fields are optional - only provided fields will be updated.

```ts
const updateWebhookToolResult = await phonic.tools.update("next_invoice", {
  name: "next_invoice_updated",
  description: "Updated description.",
  type: "custom_webhook",
  executionMode: "sync",
  endpointMethod: "POST",
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

For WebSocket tools, you would use `toolCallOutputTimeoutMs` instead of the endpoint fields:

```ts
const updateWebSocketToolResult = await phonic.tools.update("get_product_recommendations", {
  description: "Updated product recommendation tool",
  toolCallOutputTimeoutMs: 7000
});
```

### Delete tool

Deletes a tool by ID or name.

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

### Outbound call

```ts
const outboundCallResult = await phonic.conversations.outboundCall("+19189396241", {
  // Optional fields
  agent: "chris",
  template_variables: {
    customer_name: "David",
    subject: "Chess"
  },
});
```

### Outbound call using own Twilio account

In Twilio, create a restricted API key with the following permissions: `voice -> calls -> read` and `voice -> calls -> create`.

```ts
const twilioOutboundCallResult = await phonic.conversations.twilio.outboundCall(
  {
    account_sid: "AC...",
    api_key_sid: "SK...",
    api_key_secret: "...",
    from_phone_number: "+19189372905",
    to_phone_number: "+19189396241",
  }, 
  {
    // Optional fields
    agent: "chris",
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
  agent: "chris",
  template_variables: {
    customer_name: "David",
    subject: "Chess"
  },
  welcome_message: "Hello, how can I help you?",
  voice_id: "grant",
  output_format: "mulaw_8000",
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

    case "tool_call": {
      // Handle WebSocket tool calls
      console.log(`Tool ${message.tool_name} called with parameters:`, message.parameters);
      
      // Example: Process a product recommendations tool call
      if (message.tool_name === "get_product_recommendations") {
        const category = message.parameters.category;
        const recommendations = fetchRecommendations(category);
        
        phonicWebSocket.[sendToolCallOutput](#send-tool-output-to-phonic)({
          toolCallId: message.tool_call_id,
          output: {
            products: recommendations,
            total: recommendations.length
          }
        });
      }
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

### Send tool output to Phonic

When you receive a `tool_call` message for a WebSocket tool, you must respond with the tool's output using `sendToolCallOutput()`. This method sends the execution result back to Phonic so the conversation can continue.

```ts
phonicWebSocket.sendToolCallOutput({
  toolCallId: "tool_call_123...", // The tool_call_id from the tool_call message
  output: "Success! Found 2 items" // Can be any JSON-serializable value (string, number, object, array, etc.)
});

// Or with an object:
phonicWebSocket.sendToolCallOutput({
  toolCallId: message.tool_call_id,
  output: {
    result: "success",
    data: {
      items: ["item1", "item2"],
      total: 2
    }
  }
});
```

**Important notes:**
- You must use the exact `tool_call_id` received in the `tool_call` message
- The `output` can be any JSON-serializable value (string, number, boolean, object, array, etc.)
- If you don't send a response within `toolCallOutputTimeoutMs`, the tool call will be marked as failed.

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

#### `conversation_created`

```ts
{
  type: "conversation_created";
  conversation_id: string;
}
```

Sent when the conversation has been successfully created.

#### `ready_to_start_conversation`

```ts
{
  type: "ready_to_start_conversation";
}
```

Sent when Phonic is ready to begin processing audio. You should start sending audio chunks after receiving this message.

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

#### `user_started_speaking`

```ts
{
  type: "user_started_speaking";
}
```

Sent when the user begins speaking.

#### `user_finished_speaking`

```ts
{
  type: "user_finished_speaking";
}
```

Sent when the user stops speaking.

#### `interrupted_response`

```ts
{
  type: "interrupted_response",
  text: string, // partial assistant response that cuts off approximately where the user interrupted
}
```

Sent when the user interrupts the assistant, after the user has finished speaking.

#### `assistant_chose_not_to_respond`

```ts
{
  type: "assistant_chose_not_to_respond";
}
```

Sent when the assistant decides not to respond to the user's input.

#### `assistant_ended_conversation`

```ts
{
  type: "assistant_ended_conversation";
}
```

Sent when the assistant decides to end the conversation.

#### `tool_call`

```ts
{
  type: "tool_call";
  tool_call_id: string;
  tool_name: string;
  parameters: Record<string, unknown>;
}
```

Sent when a WebSocket tool is called during the conversation. When you receive this message, you should:
1. Process the tool call using the provided `tool_name` and `parameters`
2. Send back the result using `[phonicWebSocket.sendToolCallOutput](#send-tool-output-to-phonic)()`

This is only sent for tools created with `type: "custom_websocket"`. Webhook tools are executed server-side and only send `tool_call_processed_by_phonic` messages.

#### `tool_call_processed_by_phonic`

```ts
{
  type: "tool_call_processed_by_phonic";
  tool_call_id: string;
  tool: {
    id: string;
    name: string;
  };
  endpoint_url: string | null;
  endpoint_timeout_ms: number | null;
  endpoint_called_at: string | null;
  request_body: {
    call_info: {
      from_phone_number: string;
      to_phone_number: string;
    } | null;
    [key: string]: unknown;
  } | null;
  response_body: Record<string, unknown> | null;
  response_status_code: number | null;
  timed_out: boolean | null;
  error_message: string | null;
}
```
Sent when a tool is called during the conversation. Built-in tools will have null values for endpoint-related fields.

When a custom tool is called, the `request_body` field always includes a `call_info` field.
If the conversation is not a phone call, `call_info` will be `null`. If it is a phone call, `call_info` will be an object with `from_phone_number` and `to_phone_number` fields, both formatted as E.164 phone numbers (e.g., "+1234567890").

#### `error`

```ts
{
  type: "error";
  error: {
    message: string;
    code?: string;
  };
  param_errors?: Record<string, string>;
}
```

Sent when an error occurs during the conversation.

## License

MIT
