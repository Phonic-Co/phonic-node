# Reference

## Agents

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">list</a>({ ...params }) -> Phonic.AgentsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all agents in a project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.AgentsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">create</a>({ ...params }) -> Phonic.AgentsCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new agent in a project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.create({
    project: "main",
    name: "support-agent",
    phone_number: "assign-automatically",
    timezone: "America/Los_Angeles",
    voice_id: "sabrina",
    audio_speed: 1,
    background_noise_level: 0,
    generate_welcome_message: false,
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        customer_name: {
            default_value: "David",
        },
        subject: {
            default_value: "Chess",
        },
    },
    tools: ["keypad_input"],
    generate_no_input_poke_text: false,
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
    languages: ["en", "es"],
    boosted_keywords: ["Load ID", "dispatch"],
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            Authorization: "Bearer token123",
        },
        timeout_ms: 7000,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.AgentsCreateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">upsert</a>({ ...params }) -> Phonic.AgentsUpsertResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Upserts an agent by name. If an agent with the same name already exists, it will be updated. Otherwise, it will be created.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.upsert({
    project: "main",
    name: "support-agent",
    phone_number: "assign-automatically",
    timezone: "America/Los_Angeles",
    voice_id: "sabrina",
    audio_speed: 1,
    background_noise_level: 0,
    generate_welcome_message: false,
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        customer_name: {
            default_value: "David",
        },
        subject: {
            default_value: "Chess",
        },
    },
    tools: ["keypad_input"],
    generate_no_input_poke_text: false,
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
    languages: ["en", "es"],
    boosted_keywords: ["Load ID", "dispatch"],
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            Authorization: "Bearer token123",
        },
        timeout_ms: 7000,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.UpsertAgentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">get</a>(nameOrId, { ...params }) -> Phonic.AgentsGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns an agent by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.get("nameOrId", {
    project: "main",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the agent to get.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.AgentsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">delete</a>(nameOrId, { ...params }) -> Phonic.AgentsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an agent by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.delete("nameOrId", {
    project: "main",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the agent to delete.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.AgentsDeleteRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">update</a>(nameOrId, { ...params }) -> Phonic.AgentsUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an agent by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.update("nameOrId", {
    project: "main",
    name: "updated-support-agent",
    phone_number: "assign-automatically",
    timezone: "America/Los_Angeles",
    voice_id: "sabrina",
    audio_speed: 1,
    background_noise_level: 0,
    generate_welcome_message: false,
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        customer_name: {
            default_value: "David",
        },
        subject: {
            default_value: "Chess",
        },
    },
    tools: ["keypad_input"],
    generate_no_input_poke_text: false,
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
    languages: ["en", "es"],
    boosted_keywords: ["Load ID", "dispatch"],
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            Authorization: "Bearer token123",
        },
        timeout_ms: 7000,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the agent to update.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.UpdateAgentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">addCustomPhoneNumber</a>(nameOrId, { ...params }) -> Phonic.AgentsAddCustomPhoneNumberResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Adds a custom phone number to an agent. The user must configure their SIP trunk to point to Phonic's SIP server.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.addCustomPhoneNumber("nameOrId", {
    project: "main",
    phone_number: "+15551234567",
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            Authorization: "Bearer token123",
        },
        timeout_ms: 7000,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the agent.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.AgentsAddCustomPhoneNumberRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">deleteCustomPhoneNumber</a>(nameOrId, { ...params }) -> Phonic.AgentsDeleteCustomPhoneNumberResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a custom phone number from an agent.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.deleteCustomPhoneNumber("nameOrId", {
    project: "main",
    phone_number: "+15551234567",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the agent.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.AgentsDeleteCustomPhoneNumberRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">updatePhoneNumber</a>(nameOrId, { ...params }) -> Phonic.AgentsUpdatePhoneNumberResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a phone number on an agent.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.updatePhoneNumber("nameOrId", {
    project: "main",
    phone_number: "+15551234567",
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            Authorization: "Bearer token123",
        },
        timeout_ms: 7000,
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the agent.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.AgentsUpdatePhoneNumberRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Tools

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">list</a>({ ...params }) -> Phonic.ToolsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all custom tools for the organization.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.list({
    project: "main",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.ToolsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">create</a>({ ...params }) -> Phonic.ToolsCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new tool in a project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.create({
    project: "main",
    name: "context_printer",
    description: "Gets the specific context for fixing our printer",
    type: "custom_context",
    execution_mode: "sync",
    parameters: [
        {
            type: "string",
            name: "name",
            description: "description",
            is_required: true,
        },
    ],
    require_speech_before_tool_call: false,
    forbid_speech_after_tool_call: false,
    allow_tool_chaining: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.CreateToolRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">get</a>(nameOrId, { ...params }) -> Phonic.ToolsGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a tool by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.get("nameOrId", {
    project: "main",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the tool to get.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ToolsGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">delete</a>(nameOrId, { ...params }) -> Phonic.ToolsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a tool by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.delete("nameOrId", {
    project: "main",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the tool to delete.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ToolsDeleteRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tools.<a href="/src/api/resources/tools/client/Client.ts">update</a>(nameOrId, { ...params }) -> Phonic.ToolsUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a tool by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tools.update("nameOrId", {
    project: "main",
    description: "Updated description for booking appointments with enhanced features",
    endpoint_headers: {
        Authorization: "Bearer updated_token456",
    },
    endpoint_timeout_ms: 7000,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the tool to update.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.UpdateToolRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Tools.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## ExtractionSchemas

<details><summary><code>client.extractionSchemas.<a href="/src/api/resources/extractionSchemas/client/Client.ts">list</a>({ ...params }) -> Phonic.ExtractionSchemasListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all extraction schemas in a project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractionSchemas.list({
    project: "main",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.ExtractionSchemasListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractionSchemas.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.extractionSchemas.<a href="/src/api/resources/extractionSchemas/client/Client.ts">create</a>({ ...params }) -> Phonic.ExtractionSchemasCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new extraction schema in a project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractionSchemas.create({
    project: "main",
    name: "Appointment details",
    prompt: "Dates should be in `9 Apr 2025` format. Prices should be in $150.00 format.",
    fields: [
        {
            name: "Date",
            type: "string",
            description: "The date of the appointment",
        },
        {
            name: "Copay",
            type: "string",
            description: "Amount of money the patient pays for the appointment",
        },
        {
            name: "Confirmed as booked",
            type: "bool",
            description: "Is the appointment confirmed as booked?",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.CreateExtractionSchemaRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractionSchemas.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.extractionSchemas.<a href="/src/api/resources/extractionSchemas/client/Client.ts">get</a>(nameOrId, { ...params }) -> Phonic.ExtractionSchemasGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns an extraction schema by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractionSchemas.get("nameOrId", {
    project: "main",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the extraction schema to get.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ExtractionSchemasGetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractionSchemas.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.extractionSchemas.<a href="/src/api/resources/extractionSchemas/client/Client.ts">delete</a>(nameOrId, { ...params }) -> Phonic.ExtractionSchemasDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an extraction schema by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractionSchemas.delete("nameOrId", {
    project: "main",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the extraction schema to delete.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ExtractionSchemasDeleteRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractionSchemas.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.extractionSchemas.<a href="/src/api/resources/extractionSchemas/client/Client.ts">update</a>(nameOrId, { ...params }) -> Phonic.ExtractionSchemasUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an extraction schema by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.extractionSchemas.update("nameOrId", {
    project: "main",
    name: "Updated appointment details",
    prompt: "Updated extraction instructions. Dates should be in `9 Apr 2025` format.",
    fields: [
        {
            name: "Date",
            type: "string",
            description: "The date of the appointment",
        },
        {
            name: "Time",
            type: "string",
            description: "The time of the appointment",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the extraction schema to update.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.UpdateExtractionSchemaRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExtractionSchemas.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Voices

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">list</a>({ ...params }) -> Phonic.VoicesListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all available voices for a model.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.list({
    model: "merritt",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.VoicesListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">get</a>(id) -> Phonic.VoicesGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a voice by ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.voices.get("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the voice to get.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Voices.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Conversations

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">list</a>({ ...params }) -> Phonic.ConversationsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns conversations with optional filtering.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.ConversationsListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">get</a>(id) -> Phonic.ConversationsGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a conversation by ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.get("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the conversation to get.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">cancel</a>(id) -> Phonic.ConversationsCancelResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Cancels an active conversation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.cancel("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the conversation to cancel.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">getAnalysis</a>(id) -> Phonic.ConversationsGetAnalysisResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns an analysis of the specified conversation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.getAnalysis("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the conversation to analyze.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">listExtractions</a>(id) -> Phonic.ConversationsListExtractionsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all extractions for a conversation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.listExtractions("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the conversation to get extractions for.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">extractData</a>(id, { ...params }) -> Phonic.ConversationsExtractDataResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Extracts data from a conversation using a schema.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.extractData("id", {
    schema_id: "conv_extract_schema_6458e4ac-533c-4bdf-8e6d-c2f06f87fd5c",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the conversation to extract data from.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ExtractDataRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">listEvaluations</a>(id) -> Phonic.ConversationsListEvaluationsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all evaluations for a conversation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.listEvaluations("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the conversation to get evaluations for.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">evaluate</a>(id, { ...params }) -> Phonic.ConversationEvaluationResult</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Evaluates a conversation using an evaluation prompt.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.evaluate("id", {
    prompt_id: "conv_eval_prompt_d7cfe45d-35db-4ef6-a254-81ab1da76ce0",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the conversation to evaluate.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.EvaluateConversationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">outboundCall</a>({ ...params }) -> Phonic.ConversationsOutboundCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Initiates a call to a given phone number using Phonic's Twilio account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.outboundCall({
    to_phone_number: "+19189397081",
    config: {
        agent: "support-agent",
        welcome_message: "Hi {{customer_name}}. How can I help you today?",
        system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
        template_variables: {
            customer_name: "David",
            subject: "Chess",
        },
        voice_id: "sabrina",
        generate_no_input_poke_text: false,
        no_input_poke_sec: 30,
        no_input_poke_text: "Are you still there?",
        no_input_end_conversation_sec: 180,
        languages: ["en", "es"],
        boosted_keywords: ["Load ID", "dispatch"],
        tools: ["keypad_input"],
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.OutboundCallRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">sipOutboundCall</a>({ ...params }) -> Phonic.ConversationsSipOutboundCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Initiates a SIP outbound call using user-supplied SIP credentials in headers.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.conversations.sipOutboundCall({
    "X-Sip-Address": "X-Sip-Address",
    from_phone_number: "from_phone_number",
    to_phone_number: "to_phone_number",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.ConversationsSipOutboundCallRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Conversations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Auth

<details><summary><code>client.auth.<a href="/src/api/resources/auth/client/Client.ts">createSessionToken</a>({ ...params }) -> Phonic.AuthCreateSessionTokenResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a short-lived session token that can be used to authenticate WebSocket connections. Session tokens are useful for client-side applications where you don't want to expose your API key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.auth.createSessionToken({
    ttl_seconds: 300,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.CreateSessionTokenRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Auth.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Projects

<details><summary><code>client.projects.<a href="/src/api/resources/projects/client/Client.ts">list</a>() -> Phonic.ProjectsListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all projects in a workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.projects.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.projects.<a href="/src/api/resources/projects/client/Client.ts">create</a>({ ...params }) -> Phonic.ProjectsCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new project in a workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.projects.create({
    name: "customer-support",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Phonic.CreateProjectRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.projects.<a href="/src/api/resources/projects/client/Client.ts">get</a>(nameOrId) -> Phonic.ProjectsGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a project by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.projects.get("nameOrId");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the project to get.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.projects.<a href="/src/api/resources/projects/client/Client.ts">delete</a>(nameOrId) -> Phonic.ProjectsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a project by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.projects.delete("nameOrId");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the project to delete.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.projects.<a href="/src/api/resources/projects/client/Client.ts">update</a>(nameOrId, { ...params }) -> Phonic.ProjectsUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a project by name or ID.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.projects.update("nameOrId", {
    name: "updated-customer-support",
    default_agent: "another-agent",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**nameOrId:** `string` — The name or the ID of the project to update.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.UpdateProjectRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.projects.<a href="/src/api/resources/projects/client/Client.ts">listEvalPrompts</a>(id) -> Phonic.ProjectsListEvalPromptsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all conversation evaluation prompts for a project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.projects.listEvalPrompts("id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the project.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.projects.<a href="/src/api/resources/projects/client/Client.ts">createEvalPrompt</a>(id, { ...params }) -> Phonic.ProjectsCreateEvalPromptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new conversation evaluation prompt for a project.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.projects.createEvalPrompt("id", {
    name: "test_prompt",
    prompt: "The assistant used the word chocolate in the conversation",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — The ID of the project.

</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.CreateConversationEvalPromptRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Projects.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
