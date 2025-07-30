# Reference

<details><summary><code>client.<a href="/src/Client.ts">outboundCall</a>({ ...params }) -> Phonic.OutboundCallResponse</code></summary>
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
await client.outboundCall({
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

**requestOptions:** `PhonicClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

##
