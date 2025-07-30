# Reference

<details><summary><code>client.<a href="/src/Client.ts">create</a>({ ...params }) -> Phonic.CreateResponse</code></summary>
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
await client.create({
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

**requestOptions:** `PhonicClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

##

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
    name: "support-agent",
    phone_number: "assign-automatically",
    timezone: "America/Los_Angeles",
    voice_id: "sarah",
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        customer_name: {},
        subject: {
            default_value: "Chess",
        },
    },
    tools: ["keypad_input"],
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
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

**request:** `Phonic.CreateAgentRequest`

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
    name: "support-agent",
    phone_number: "assign-automatically",
    timezone: "America/Los_Angeles",
    voice_id: "sarah",
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        customer_name: {},
        subject: {
            default_value: "Chess",
        },
    },
    tools: ["keypad_input"],
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
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
await client.agents.get("nameOrId");
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
await client.agents.delete("nameOrId");
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
    name: "updated-support-agent",
    phone_number: "assign-automatically",
    timezone: "America/Los_Angeles",
    voice_id: "sarah",
    welcome_message: "Hi {{customer_name}}. How can I help you today?",
    system_prompt: "You are an expert in {{subject}}. Be friendly, helpful and concise.",
    template_variables: {
        customer_name: {},
        subject: {
            default_value: "Chess",
        },
    },
    tools: ["keypad_input"],
    no_input_poke_sec: 30,
    no_input_poke_text: "Are you still there?",
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

## Conversations

<details><summary><code>client.conversations.<a href="/src/api/resources/conversations/client/Client.ts">outboundCall</a>({ ...params }) -> Phonic.ConversationsOutboundCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Initiates a call to a given phone number.

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
        voice_id: "sarah",
        no_input_poke_sec: 30,
        no_input_poke_text: "Are you still there?",
        no_input_end_conversation_sec: 180,
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
