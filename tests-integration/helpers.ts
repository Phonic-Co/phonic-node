// Maintained manually (listed in .fernignore). Fern does not overwrite this file.
//
// Shared helpers for the live integration test suite. These tests run against a
// real Phonic API (the test environment by default) to make sure Fern-generated
// code and `.fernignore`-protected overrides keep working end to end.

import * as fs from "node:fs";
import * as path from "node:path";

import { PhonicClient } from "../src/Client";

/**
 * Loads `KEY=VALUE` pairs from a `.env.local` file at the repo root into
 * `process.env` (without overwriting variables already set, e.g. CI secrets).
 * This lets the suite run locally with no extra tooling, while CI just sets
 * real environment variables. Avoids adding a `dotenv` dependency.
 */
function loadDotEnvLocal(): void {
    const envPath = path.resolve(__dirname, "../.env.local");
    if (!fs.existsSync(envPath)) {
        return;
    }
    const contents = fs.readFileSync(envPath, "utf-8");
    for (const rawLine of contents.split("\n")) {
        const line = rawLine.trim();
        if (line === "" || line.startsWith("#")) {
            continue;
        }
        const eq = line.indexOf("=");
        if (eq === -1) {
            continue;
        }
        const key = line.slice(0, eq).trim();
        let value = line.slice(eq + 1).trim();
        // Strip surrounding single or double quotes.
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}

loadDotEnvLocal();

export const apiKey: string | undefined = process.env.PHONIC_API_KEY;

/**
 * Whether the integration suite has the credentials it needs to run. When
 * false (e.g. on a fork PR without secrets), the suites use `describe.skip` so
 * they report as skipped rather than failing.
 */
export const hasCredentials: boolean = Boolean(apiKey);

/**
 * Root host of the API to test against, e.g. `https://api.test.phonic.co`.
 * Defaults to production if unset. Note this is the *host root* without the
 * `/v1` suffix — we derive the HTTP and WebSocket base URLs from it below.
 */
function getApiRoot(): string {
    const raw = process.env.PHONIC_API_BASE_URL?.trim();
    const root = raw && raw !== "" ? raw : "https://api.phonic.ai";
    // Normalize: drop a trailing slash and a trailing `/v1` if someone passed one.
    return root.replace(/\/+$/, "").replace(/\/v1$/, "");
}

/**
 * Builds the `environment` URLs the SDK expects.
 * - HTTP requests join `base` with the resource path, so `base` must end in `/v1`.
 * - `conversations.connect()` joins `production` with `/v1/sts/ws`, so
 *   `production` must be the `ws(s)://` host root *without* `/v1`.
 */
export function getEnvironmentUrls(): { base: string; production: string } {
    const root = getApiRoot();
    const wsRoot = root.replace(/^http/, "ws");
    return {
        base: `${root}/v1`,
        production: wsRoot,
    };
}

export interface CreateClientOptions {
    reconnectConversationOnAbnormalDisconnect?: boolean;
}

export function createClient(options: CreateClientOptions = {}): PhonicClient {
    return new PhonicClient({
        apiKey,
        environment: getEnvironmentUrls(),
        // Keep retries low so failures surface quickly in CI.
        maxRetries: 1,
        ...options,
    });
}

/**
 * Generates a unique, API-valid resource name (lowercase letters, numbers and
 * hyphens) so concurrent runs don't collide and leftover resources are
 * identifiable. Prefixed with `sdk-ci-` for easy cleanup.
 */
export function uniqueName(prefix: string): string {
    const suffix = Math.random().toString(36).slice(2, 10);
    return `sdk-ci-${prefix}-${suffix}`;
}

/** Tools require snake_case names. */
export function uniqueToolName(prefix: string): string {
    return uniqueName(prefix).replace(/-/g, "_");
}

/** `describe` that becomes `describe.skip` when credentials are missing. */
export const describeIntegration = hasCredentials ? describe : describe.skip;
