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

**requestOptions:** `AgentsClient.RequestOptions` 
    
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
    is_welcome_message_interruptible: true,
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        "customer_name": {
            default_value: "David"
        },
        "subject": {
            default_value: "Chess"
        }
    },
    tools: ["keypad_input"],
    generate_no_input_poke_text: false,
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
    default_language: "en",
    additional_languages: ["es"],
    multilingual_mode: "request",
    push_to_talk: false,
    boosted_keywords: ["Load ID", "dispatch"],
    pronunciation_dictionary: [{
            word: "Phuket",
            pronunciation: "Poo-ket"
        }],
    min_words_to_interrupt: 1,
    turn_taking: "standard",
    max_conversation_duration_sec: 7200,
    detect_voicemail_tone: true,
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            "Authorization": "Bearer token123"
        },
        timeout_ms: 7000
    }
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

**requestOptions:** `AgentsClient.RequestOptions` 
    
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
    is_welcome_message_interruptible: true,
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        "customer_name": {
            default_value: "David"
        },
        "subject": {
            default_value: "Chess"
        }
    },
    tools: ["keypad_input"],
    generate_no_input_poke_text: false,
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
    default_language: "en",
    additional_languages: ["es"],
    multilingual_mode: "request",
    push_to_talk: false,
    boosted_keywords: ["Load ID", "dispatch"],
    pronunciation_dictionary: [{
            word: "Phuket",
            pronunciation: "Poo-ket"
        }],
    min_words_to_interrupt: 1,
    turn_taking: "standard",
    max_conversation_duration_sec: 7200,
    detect_voicemail_tone: true,
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            "Authorization": "Bearer token123"
        },
        timeout_ms: 7000
    }
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

**requestOptions:** `AgentsClient.RequestOptions` 
    
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
    project: "main"
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

**requestOptions:** `AgentsClient.RequestOptions` 
    
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
    project: "main"
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

**requestOptions:** `AgentsClient.RequestOptions` 
    
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
    is_welcome_message_interruptible: true,
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        "customer_name": {
            default_value: "David"
        },
        "subject": {
            default_value: "Chess"
        }
    },
    tools: ["keypad_input"],
    generate_no_input_poke_text: false,
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
    default_language: "en",
    additional_languages: ["es"],
    multilingual_mode: "request",
    push_to_talk: false,
    boosted_keywords: ["Load ID", "dispatch"],
    pronunciation_dictionary: [{
            word: "Phuket",
            pronunciation: "Poo-ket"
        }],
    min_words_to_interrupt: 1,
    turn_taking: "standard",
    max_conversation_duration_sec: 7200,
    detect_voicemail_tone: true,
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            "Authorization": "Bearer token123"
        },
        timeout_ms: 7000
    }
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

**requestOptions:** `AgentsClient.RequestOptions` 
    
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

Adds a bring-your-own phone number to an agent in the authenticated workspace and project. Use this to connect a phone number and SIP trunk the user is authorized to manage; it does not purchase a number or place a call. Stores the supplied SIP address and credentials for calls and transfers, and saves any configuration endpoint for calls on this number. The user must configure their SIP trunk to route inbound calls to Phonic. A configured endpoint receives requests during call setup; use only an endpoint the user intends Phonic to contact.
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
    "X-Sip-Address": "X-Sip-Address",
    "X-Sip-Auth-Username": "X-Sip-Auth-Username",
    "X-Sip-Auth-Password": "X-Sip-Auth-Password",
    project: "main",
    phone_number: "+15551234567",
    configuration_endpoint: {
        url: "https://api.example.com/config",
        headers: {
            "Authorization": "Bearer token123"
        },
        timeout_ms: 7000
    },
    sip: {
        transport: "tls",
        media_encryption: "required"
    }
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

**requestOptions:** `AgentsClient.RequestOptions` 
    
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
    phone_number: "+15551234567"
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

**requestOptions:** `AgentsClient.RequestOptions` 
    
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
            "Authorization": "Bearer token123"
        },
        timeout_ms: 7000
    }
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

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">disable</a>(nameOrId, { ...params }) -> Phonic.AgentsDisableResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Disables an agent by name or ID. A disabled agent cannot start conversations or be updated, except to release its phone numbers.
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
await client.agents.disable("nameOrId", {
    project: "main"
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

**request:** `Phonic.AgentsDisableRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">enable</a>(nameOrId, { ...params }) -> Phonic.AgentsEnableResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Enables a previously disabled agent by name or ID.
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
await client.agents.enable("nameOrId", {
    project: "main"
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

**request:** `Phonic.AgentsEnableRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
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
    project: "main"
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

**requestOptions:** `ToolsClient.RequestOptions` 
    
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
    parameters: [{
            type: "string",
            name: "name",
            description: "description",
            is_required: true
        }],
    require_speech_before_tool_call: false,
    forbid_speech_after_tool_call: false,
    allow_tool_chaining: true,
    context: "Press the A button 5 times then gently shake the printer."
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

**requestOptions:** `ToolsClient.RequestOptions` 
    
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
    project: "main"
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

**requestOptions:** `ToolsClient.RequestOptions` 
    
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
    project: "main"
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

**requestOptions:** `ToolsClient.RequestOptions` 
    
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
        "Authorization": "Bearer updated_token456"
    },
    endpoint_timeout_ms: 7000
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

**requestOptions:** `ToolsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## McpServers
<details><summary><code>client.mcpServers.<a href="/src/api/resources/mcpServers/client/Client.ts">list</a>({ ...params }) -> Phonic.McpServersListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all MCP servers in a project.
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
await client.mcpServers.list({
    project: "main"
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

**request:** `Phonic.McpServersListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `McpServersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.mcpServers.<a href="/src/api/resources/mcpServers/client/Client.ts">create</a>({ ...params }) -> Phonic.McpServersCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an MCP server in the authenticated workspace and project. Phonic connects to the server, lists its tools and saves them alongside the server, so the server must be reachable from Phonic's network. The supplied headers are sent on every request Phonic makes to the server; their values are stored encrypted and never returned. Creating the server does not attach it to an agent; add its ID to an agent's `mcp_server_ids` to make its tools available.
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
await client.mcpServers.create({
    project: "main",
    name: "crm_server",
    url: "https://mcp.example.com/mcp",
    headers: {
        "Authorization": "Bearer token123"
    }
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

**request:** `Phonic.CreateMcpServerRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `McpServersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.mcpServers.<a href="/src/api/resources/mcpServers/client/Client.ts">get</a>(nameOrId, { ...params }) -> Phonic.McpServersGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns an MCP server by name or ID.
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
await client.mcpServers.get("nameOrId", {
    project: "main"
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

**nameOrId:** `string` — The name or the ID of the MCP server to get.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.McpServersGetRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `McpServersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.mcpServers.<a href="/src/api/resources/mcpServers/client/Client.ts">delete</a>(nameOrId, { ...params }) -> Phonic.McpServersDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an MCP server by name or ID and removes it from every agent's `mcp_server_ids`.
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
await client.mcpServers.delete("nameOrId", {
    project: "main"
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

**nameOrId:** `string` — The name or the ID of the MCP server to delete.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.McpServersDeleteRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `McpServersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.mcpServers.<a href="/src/api/resources/mcpServers/client/Client.ts">update</a>(nameOrId, { ...params }) -> Phonic.McpServersUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the name and/or headers of an existing MCP server by name or ID. Providing `headers` replaces all existing headers. The URL cannot be changed; delete and re-create the server instead.
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
await client.mcpServers.update("nameOrId", {
    project: "main",
    headers: {
        "Authorization": "Bearer new_token456"
    }
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

**nameOrId:** `string` — The name or the ID of the MCP server to update.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.UpdateMcpServerRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `McpServersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ExternalStoragePolicies
<details><summary><code>client.externalStoragePolicies.<a href="/src/api/resources/externalStoragePolicies/client/Client.ts">list</a>({ ...params }) -> Phonic.ExternalStoragePoliciesListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all external storage policies in a project.
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
await client.externalStoragePolicies.list({
    project: "main"
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

**request:** `Phonic.ExternalStoragePoliciesListRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExternalStoragePoliciesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.externalStoragePolicies.<a href="/src/api/resources/externalStoragePolicies/client/Client.ts">create</a>({ ...params }) -> Phonic.ExternalStoragePoliciesCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a named external storage policy in the authenticated workspace and project, storing the supplied S3-compatible destination and credentials for later artifact delivery. Use this when the user wants agents to export conversation artifacts to a bucket they are authorized to use. Agents referencing this policy send conversation artifacts, which may contain personal data, to that external destination. Creating the policy does not attach it to an agent or export existing conversations.
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
await client.externalStoragePolicies.create({
    project: "main",
    name: "conversation_archive",
    endpoint_url: "https://storage.example.com",
    bucket: "conversation-audio",
    region: "us-east-1",
    key_prefix: "phonic/conversations",
    addressing_style: "auto",
    access_key_id: "AKIAIOSFODNN7EXAMPLE",
    secret_access_key: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
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

**request:** `Phonic.CreateExternalStoragePolicyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExternalStoragePoliciesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.externalStoragePolicies.<a href="/src/api/resources/externalStoragePolicies/client/Client.ts">get</a>(nameOrId, { ...params }) -> Phonic.ExternalStoragePoliciesGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns an external storage policy by name or ID.
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
await client.externalStoragePolicies.get("nameOrId", {
    project: "main"
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

**nameOrId:** `string` — The name or the ID of the external storage policy to get.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ExternalStoragePoliciesGetRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExternalStoragePoliciesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.externalStoragePolicies.<a href="/src/api/resources/externalStoragePolicies/client/Client.ts">delete</a>(nameOrId, { ...params }) -> Phonic.ExternalStoragePoliciesDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an external storage policy by name or ID. The policy must not be referenced by any agent.
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
await client.externalStoragePolicies.delete("nameOrId", {
    project: "main"
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

**nameOrId:** `string` — The name or the ID of the external storage policy to delete.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ExternalStoragePoliciesDeleteRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExternalStoragePoliciesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.externalStoragePolicies.<a href="/src/api/resources/externalStoragePolicies/client/Client.ts">update</a>(nameOrId, { ...params }) -> Phonic.ExternalStoragePoliciesUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the supplied fields of an existing external storage policy by name or ID in the authenticated workspace and project. Use this to change the artifact destination or rotate its credentials. Changes affect subsequent artifact delivery for agents referencing the policy; changing the endpoint or bucket can send conversation artifacts, which may contain personal data, to a different external destination. Confirm the intended destination before updating. Rotate credentials by providing both `access_key_id` and `secret_access_key`. This operation does not move or delete artifacts already delivered.
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
await client.externalStoragePolicies.update("nameOrId", {
    project: "main",
    bucket: "conversation-audio-archive",
    key_prefix: "phonic/archive"
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

**nameOrId:** `string` — The name or the ID of the external storage policy to update.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.UpdateExternalStoragePolicyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ExternalStoragePoliciesClient.RequestOptions` 
    
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
    project: "main"
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

**requestOptions:** `ExtractionSchemasClient.RequestOptions` 
    
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
    fields: [{
            name: "Date",
            type: "string",
            description: "The date of the appointment"
        }, {
            name: "Copay",
            type: "string",
            description: "Amount of money the patient pays for the appointment"
        }, {
            name: "Confirmed as booked",
            type: "bool",
            description: "Is the appointment confirmed as booked?"
        }]
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

**requestOptions:** `ExtractionSchemasClient.RequestOptions` 
    
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
    project: "main"
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

**requestOptions:** `ExtractionSchemasClient.RequestOptions` 
    
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
    project: "main"
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

**requestOptions:** `ExtractionSchemasClient.RequestOptions` 
    
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
    fields: [{
            name: "Date",
            type: "string",
            description: "The date of the appointment"
        }, {
            name: "Time",
            type: "string",
            description: "The time of the appointment"
        }]
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

**requestOptions:** `ExtractionSchemasClient.RequestOptions` 
    
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

Returns all available voices.
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
await client.voices.list();

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

**requestOptions:** `VoicesClient.RequestOptions` 
    
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

**requestOptions:** `VoicesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.voices.<a href="/src/api/resources/voices/client/Client.ts">preview</a>({ ...params }) -> Phonic.TtsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generates speech audio for the provided text and returns it as a single base64-encoded string.
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
await client.voices.preview({
    text: "Thanks for calling Phonic. How can I help?",
    voice_id: "grant",
    output_format: "pcm_16000"
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

**request:** `Phonic.StreamTtsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `VoicesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Workspace
<details><summary><code>client.workspace.<a href="/src/api/resources/workspace/client/Client.ts">get</a>() -> Phonic.WorkspaceGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns information about the workspace. An API key must have workspace access.
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
await client.workspace.get();

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

**requestOptions:** `WorkspaceClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.workspace.<a href="/src/api/resources/workspace/client/Client.ts">update</a>({ ...params }) -> Phonic.WorkspaceUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the workspace. An API key must have workspace access.
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
await client.workspace.update({
    logo_url: "https://example.com/logo.png",
    invite_link_allowed_domains: ["example.com"],
    ip_allowlist: ["203.0.113.0/24"]
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

**request:** `Phonic.UpdateWorkspaceRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WorkspaceClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ApiKeys
<details><summary><code>client.apiKeys.<a href="/src/api/resources/apiKeys/client/Client.ts">create</a>({ ...params }) -> Phonic.CreateApiKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new API key in the workspace.

Requires an API key with workspace access, or an access token. The new
key's `scope` must be within the caller's scope. Omit `scope` and an
API key copies its own scope onto the new key. An access token that
omits `scope` creates a key with access to every project and to
workspace management.
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
await client.apiKeys.create({
    name: "billing-key",
    scope: {
        workspace_access: false,
        project_access: "selected",
        project_ids: ["proj_ad0334f1-2487-4155-9df3-abd8129b29ad"]
    }
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

**request:** `Phonic.CreateApiKeyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApiKeysClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.apiKeys.<a href="/src/api/resources/apiKeys/client/Client.ts">delete</a>(id) -> Phonic.ApiKeysDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an API key.

Requires an API key with workspace access, or an access token. The
caller can delete a key only when that key's scope is within the
caller's scope.
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
await client.apiKeys.delete("id");

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

**id:** `string` — The ID of the API key to delete.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApiKeysClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.apiKeys.<a href="/src/api/resources/apiKeys/client/Client.ts">update</a>(id, { ...params }) -> Phonic.ApiKeysUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an API key's name, scope, or both. Send at least one of `name`
and `scope`.

Requires an API key with workspace access, or an access token. The
caller can update a key only when that key's current scope is within
the caller's scope, and a new `scope` must also be within the caller's
scope.
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
await client.apiKeys.update("id", {
    name: "billing-key",
    scope: {
        workspace_access: false,
        project_access: "selected",
        project_ids: ["proj_ad0334f1-2487-4155-9df3-abd8129b29ad"]
    }
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

**id:** `string` — The ID of the API key to update.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.UpdateApiKeyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApiKeysClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.apiKeys.<a href="/src/api/resources/apiKeys/client/Client.ts">rotate</a>(id) -> Phonic.ApiKeyWithSecret</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Rotates an API key, generating a new secret and invalidating the old
one. The new key keeps the previous key's name and scope.

Requires an API key with workspace access, or an access token. The
caller can rotate a key only when that key's scope is within the
caller's scope.
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
await client.apiKeys.rotate("id");

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

**id:** `string` — The ID of the API key to rotate.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ApiKeysClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Webhooks
<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">list</a>() -> Phonic.WebhooksListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the workspace's webhooks, newest first.

Requires workspace access. An API key restricted to selected projects
only sees webhooks whose projects are all within its scope.
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
await client.webhooks.list();

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

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">create</a>({ ...params }) -> Phonic.CreateWebhookResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a webhook that sends the chosen events for the chosen projects
to `endpoint_url`. The response includes the webhook's signing secret.

Requires an API key with workspace access, or an access token. An API
key restricted to selected projects can only use projects within its
scope.
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
await client.webhooks.create({
    endpoint_url: "https://example.com/phonic/webhooks",
    events: ["conversation.ended", "conversation.analysis"],
    project_ids: ["proj_ad0334f1-2487-4155-9df3-abd8129b29ad"]
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

**request:** `Phonic.CreateWebhookRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">get</a>(id) -> Phonic.WebhooksGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a webhook.

Requires workspace access. An API key restricted to selected projects
can only get a webhook whose projects are all within its scope.
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
await client.webhooks.get("id");

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

**id:** `string` — The ID of the webhook.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">delete</a>(id) -> Phonic.WebhooksDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a webhook.

Requires an API key with workspace access, or an access token. An API
key restricted to selected projects can only delete a webhook whose
projects are all within its scope.
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
await client.webhooks.delete("id");

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

**id:** `string` — The ID of the webhook to delete.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">update</a>(id, { ...params }) -> Phonic.WebhooksUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a webhook's events, projects, or both. The endpoint URL cannot
be changed; create a new webhook instead.

Requires an API key with workspace access, or an access token. An API
key restricted to selected projects can only update a webhook whose
current and new projects are all within its scope.
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
await client.webhooks.update("id", {
    events: ["conversation.ended", "conversation.transferred"]
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

**id:** `string` — The ID of the webhook to update.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.UpdateWebhookRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">getSecret</a>(id) -> Phonic.WebhooksGetSecretResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the secret used to sign the webhook's requests.

Requires an API key with workspace access, or an access token. An API
key restricted to selected projects can only get the secret of a
webhook whose projects are all within its scope.
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
await client.webhooks.getSecret("id");

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

**id:** `string` — The ID of the webhook.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `WebhooksClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ConversationItems
<details><summary><code>client.conversationItems.<a href="/src/api/resources/conversationItems/client/Client.ts">replay</a>(id, { ...params }) -> Phonic.ReplayConversationItemResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the alternative response(s) the assistant would have
produced for this conversation turn given changes to the agent system prompt.

Only assistant items from ended conversations can be replayed. Omit the
request body (or omit `system_prompt`) to replay the turn exactly as it
originally ran.
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
await client.conversationItems.replay("id");

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

**id:** `string` — The ID of the conversation item to replay.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ReplayConversationItemRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConversationItemsClient.RequestOptions` 
    
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

Returns conversations with optional filtering. Each item is the full conversation object returned by [Get conversation](/api-reference/conversations/get), including transcripts, `system_prompt` and `items`.
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">get</a>(id, { ...params }) -> Phonic.ConversationsGetResponse</code></summary>
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

**request:** `Phonic.ConversationsGetRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConversationsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">delete</a>(id) -> Phonic.ConversationsDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a conversation, scheduling its transcripts and audio recordings for deletion. The conversation must have ended.
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
await client.conversations.delete("id");

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

**id:** `string` — The ID of the conversation to delete.
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConversationsClient.RequestOptions` 
    
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
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
    schema_id: "conv_extract_schema_6458e4ac-533c-4bdf-8e6d-c2f06f87fd5c"
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">evaluate</a>(id, { ...params }) -> Phonic.ConversationsEvaluateResponse</code></summary>
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
    prompt_id: "conv_eval_prompt_d7cfe45d-35db-4ef6-a254-81ab1da76ce0"
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
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
            "customer_name": "David",
            "subject": "Chess"
        },
        voice_id: "sabrina",
        generate_no_input_poke_text: false,
        no_input_poke_sec: 30,
        no_input_poke_text: "Are you still there?",
        no_input_end_conversation_sec: 180,
        default_language: "en",
        additional_languages: ["es"],
        multilingual_mode: "request",
        push_to_talk: false,
        boosted_keywords: ["Load ID", "dispatch"],
        pronunciation_dictionary: [{
                word: "Phuket",
                pronunciation: "Poo-ket"
            }],
        min_words_to_interrupt: 1,
        turn_taking: "standard",
        max_conversation_duration_sec: 7200,
        detect_voicemail_tone: true,
        tools: ["keypad_input"]
    },
    dry_run: false
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
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

Places an outbound voice-agent phone call through the user's SIP trunk using the supplied SIP credentials, caller ID, destination phone number, and conversation configuration. Use only when the user requests a call to that recipient and is authorized to use the trunk and caller ID. With `dry_run` omitted or false, this contacts the recipient and may incur telephony charges; repeating a successful request may place another call. Set `dry_run` to true to validate setup without placing a call. A dry run does not verify that the recipient can be reached or test call audio.
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
    to_phone_number: "to_phone_number"
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

**requestOptions:** `ConversationsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">replay</a>(id, { ...params }) -> Phonic.ConversationsReplayResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Replays an ended conversation by re-running its recorded audio through an
agent. Requires API key or access token authentication. The conversation must
have audio recordings available and an associated agent (or one specified in
the request body).
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
await client.conversations.replay("id", {
    agent: "support-agent"
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

**id:** `string` — The ID of the conversation to replay.
    
</dd>
</dl>

<dl>
<dd>

**request:** `Phonic.ReplayConversationRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ConversationsClient.RequestOptions` 
    
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
    ttl_seconds: 300
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

**requestOptions:** `AuthClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.auth.<a href="/src/api/resources/auth/client/Client.ts">createConversationToken</a>({ ...params }) -> Phonic.AuthCreateConversationTokenResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a short-lived conversation token scoped to a specific agent. Conversation tokens are useful for client-side applications that start a conversation with a single agent without exposing your API key.
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
await client.auth.createConversationToken({
    agent_id: "agent_12cf6e88-c254-4d3e-a149-a7f1bdd22783",
    ttl_seconds: 30
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

**request:** `Phonic.CreateConversationTokenRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AuthClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Tts
<details><summary><code>client.tts.<a href="/src/api/resources/tts/client/Client.ts">stream</a>({ ...params }) -> core.BinaryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Streams generated speech audio for the provided text.
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
await client.tts.stream({
    text: "x"
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

**request:** `Phonic.StreamTtsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TtsClient.RequestOptions` 
    
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

Returns the projects in the workspace. An API key limited to selected
projects receives only those projects.
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

**requestOptions:** `ProjectsClient.RequestOptions` 
    
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

Creates a new project in the workspace. An API key must have workspace access.
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
    name: "customer-support"
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

**requestOptions:** `ProjectsClient.RequestOptions` 
    
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

Returns a project by name or ID. An API key can read a project only when that project is in its scope.
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

**requestOptions:** `ProjectsClient.RequestOptions` 
    
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

Deletes a project by name or ID. An API key can delete a project only when that project is in its scope.
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

**requestOptions:** `ProjectsClient.RequestOptions` 
    
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

Updates a project by name or ID. An API key can update a project only when that project is in its scope.
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
    default_agent: "another-agent"
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

**requestOptions:** `ProjectsClient.RequestOptions` 
    
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

**requestOptions:** `ProjectsClient.RequestOptions` 
    
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
    prompt: "The assistant used the word chocolate in the conversation"
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

**requestOptions:** `ProjectsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.projects.<a href="/src/api/resources/projects/client/Client.ts">listEvals</a>(id) -> Phonic.ProjectsListEvalsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all conversation evaluation results for a project.
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
await client.projects.listEvals("id");

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

**requestOptions:** `ProjectsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Responses
<details><summary><code>client.responses.<a href="/src/api/resources/responses/client/Client.ts">create</a>({ ...params }) -> Phonic.GenerateResponsesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generates one or more alternative assistant responses for a conversation
you supply inline to simulate Phonic agent behavior.

This endpoint is stateless, so it does not create a new conversation or
store anything. The request carries the system prompt, a conversation so
far as `input`, and the tools the assistant may call.

There are two different types of tool configurations:

- `tool_definitions`: defined inline. Typically if you use LiveKit, this
  is where you can pass in your tool definitions.
- `tools`: tools that already exist in Phonic, in the same shape as the
  STS WebSocket `config` message. Built-in tools such as
  `choose_not_to_respond` are passed by their built-in name or as a
  `{type: "built_in", name, tool_config}` object. The only tools stored in
  `project` that can be referenced by name are transfer tools (transfer to
  phone number and transfer to agent). Stored built-in tool instances
  (such as a saved choose not to respond, natural conversation ending or
  keypad input tool) cannot be referenced by their saved name; pass the
  built-in itself instead. Your context, webhook, MCP and WebSocket tools
  cannot be referenced here yet; define those inline as `tool_definitions`.

Each item in `input` is a user message, an assistant message (with
optional `tool_calls` or an `action`), or a `tool_call_output`. Every
assistant tool call must be followed immediately by the
`tool_call_output` item that carries its result.

A tool referenced in `tools` resolves to an `action` on the generated
response rather than a tool call - the event a live conversation would
have emitted, without the effect actually being carried out.
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
await client.responses.create({
    system_prompt: "You help callers find a pizza shop. Be friendly and concise.",
    voice_id: "sabrina",
    default_language: "en",
    additional_languages: ["es"],
    input: [{
            role: "user",
            text: "Where should I get pizza near Union Square?"
        }],
    tool_definitions: [{
            name: "search_pizza_shop_recs",
            description: "Search for pizza shop recommendations.",
            parameters: {
                type: "object",
                properties: {
                    "location": {
                        "type": "string",
                        "description": "The neighborhood to search in."
                    }
                },
                required: [
                    "location"
                ],
                additionalProperties: false
            }
        }],
    model: "phonic-1",
    num_responses: 2
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

**request:** `Phonic.GenerateResponsesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ResponsesClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

