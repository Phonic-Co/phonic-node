# Phonic TypeScript Library

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2FPhonic-Co%2Fphonic-node)
[![npm shield](https://img.shields.io/npm/v/phonic)](https://www.npmjs.com/package/phonic)

The Phonic TypeScript library provides convenient access to the Phonic APIs from TypeScript.

## Installation

```sh
npm i -s phonic
```

## Reference

A full reference for this library is available [here](https://github.com/Phonic-Co/phonic-node/blob/HEAD/./reference.md).

## Usage

Instantiate and use the client with the following:

```typescript
import { PhonicClient } from "phonic";

const client = new PhonicClient({ apiKey: "YOUR_API_KEY" });
await client.agents.create({
    project: "main",
    name: "support-agent",
    phone_number: "assign-automatically",
    timezone: "America/Los_Angeles",
    voice_id: "grant",
    audio_speed: 1,
    background_noise_level: 0,
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

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Phonic } from "phonic";

const request: Phonic.AgentsListRequest = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { PhonicError } from "phonic";

try {
    await client.agents.create(...);
} catch (err) {
    if (err instanceof PhonicError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
        console.log(err.rawResponse);
    }
}
```

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.agents.create(..., {
    headers: {
        'X-Custom-Header': 'custom value'
    }
});
```

### Additional Query String Parameters

If you would like to send additional query string parameters as part of the request, use the `queryParams` request option.

```typescript
const response = await client.agents.create(..., {
    queryParams: {
        'customQueryParamKey': 'custom query param value'
    }
});
```

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long
as the request is deemed retryable and the number of retry attempts has not grown larger than the configured
retry limit (default: 2).

A request is deemed retryable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)

Use the `maxRetries` request option to configure this behavior.

```typescript
const response = await client.agents.create(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.agents.create(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.agents.create(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method.
The `.withRawResponse()` method returns a promise that results to an object with a `data` and a `rawResponse` property.

```typescript
const { data, rawResponse } = await client.agents.create(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers['X-My-Header']);
```

### Runtime Compatibility

The SDK works in the following runtimes:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

### Customizing Fetch Client

The SDK provides a way for you to customize the underlying HTTP client / Fetch function. If you're running in an
unsupported environment, this provides a way for you to break glass and ensure the SDK works.

```typescript
import { PhonicClient } from "phonic";

const client = new PhonicClient({
    ...
    fetcher: // provide your implementation here
});
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
