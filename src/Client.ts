// Maintained manually (listed in .fernignore). Fern does not overwrite this file.

import { AgentsClient } from "./api/resources/agents/client/Client.js";
import { AuthClient } from "./api/resources/auth/client/Client.js";
import { ConversationItemsClient } from "./api/resources/conversationItems/client/Client.js";
import { ConversationsClient } from "./api/resources/conversations/client/Client.js";
import { ExtractionSchemasClient } from "./api/resources/extractionSchemas/client/Client.js";
import { ProjectsClient } from "./api/resources/projects/client/Client.js";
import { ToolsClient } from "./api/resources/tools/client/Client.js";
import { VoicesClient } from "./api/resources/voices/client/Client.js";
import { WorkspaceClient } from "./api/resources/workspace/client/Client.js";
import type { BaseClientOptions, BaseRequestOptions } from "./BaseClient.js";
import { type NormalizedClientOptionsWithAuth, normalizeClientOptionsWithAuth } from "./BaseClient.js";
import * as core from "./core/index.js";
import * as environments from "./environments.js";

export declare namespace PhonicClient {
    export type Options = BaseClientOptions & {
        /**
         * When `true`, conversation WebSockets automatically reconnect after an
         * abnormal disconnect (WebSocket close code 1006) using `reconnect_conv_id`.
         * Defaults to `false` until the behavior is broadly validated in production;
         * set to `true` to opt in early.
         */
        reconnectConversationOnAbnormalDisconnect?: boolean;
    };

    export interface RequestOptions extends BaseRequestOptions {}
}

export class PhonicClient {
    protected readonly _options: NormalizedClientOptionsWithAuth<PhonicClient.Options>;
    protected _agents: AgentsClient | undefined;
    protected _tools: ToolsClient | undefined;
    protected _extractionSchemas: ExtractionSchemasClient | undefined;
    protected _voices: VoicesClient | undefined;
    protected _conversations: ConversationsClient | undefined;
    protected _conversationItems: ConversationItemsClient | undefined;
    protected _auth: AuthClient | undefined;
    protected _projects: ProjectsClient | undefined;
    protected _workspace: WorkspaceClient | undefined;

    constructor(options: PhonicClient.Options = {}) {
        this._options = normalizeClientOptionsWithAuth(options);
    }

    public get agents(): AgentsClient {
        return (this._agents ??= new AgentsClient(this._options));
    }

    public get tools(): ToolsClient {
        return (this._tools ??= new ToolsClient(this._options));
    }

    public get extractionSchemas(): ExtractionSchemasClient {
        return (this._extractionSchemas ??= new ExtractionSchemasClient(this._options));
    }

    public get voices(): VoicesClient {
        return (this._voices ??= new VoicesClient(this._options));
    }

    public get conversations(): ConversationsClient {
        return (this._conversations ??= new ConversationsClient(this._options));
    }

    public get conversationItems(): ConversationItemsClient {
        return (this._conversationItems ??= new ConversationItemsClient(this._options));
    }

    public get auth(): AuthClient {
        return (this._auth ??= new AuthClient(this._options));
    }

    public get projects(): ProjectsClient {
        return (this._projects ??= new ProjectsClient(this._options));
    }

    public get workspace(): WorkspaceClient {
        return (this._workspace ??= new WorkspaceClient(this._options));
    }

    /**
     * Make a passthrough request using the SDK's configured auth, retry, logging, etc.
     * This is useful for making requests to endpoints not yet supported in the SDK.
     * The input can be a URL string, URL object, or Request object. Relative paths are resolved against the configured base URL.
     *
     * @param {Request | string | URL} input - The URL, path, or Request object.
     * @param {RequestInit} init - Standard fetch RequestInit options.
     * @param {core.PassthroughRequest.RequestOptions} requestOptions - Per-request overrides (timeout, retries, headers, abort signal).
     * @returns {Promise<Response>} A standard Response object.
     */
    public async fetch(
        input: Request | string | URL,
        init?: RequestInit,
        requestOptions?: core.PassthroughRequest.RequestOptions,
    ): Promise<Response> {
        return core.makePassthroughRequest(
            input,
            init,
            {
                baseUrl:
                    this._options.baseUrl ??
                    (async () => {
                        const env = await core.Supplier.get(this._options.environment);
                        return typeof env === "string"
                            ? env
                            : ((env as Record<string, string>)?.base ?? environments.PhonicEnvironment.Default.base);
                    }),
                headers: this._options.headers,
                timeoutInSeconds: this._options.timeoutInSeconds,
                maxRetries: this._options.maxRetries,
                fetch: this._options.fetch,
                logging: this._options.logging,
                getAuthHeaders: async () => (await this._options.authProvider.getAuthRequest()).headers,
            },
            requestOptions,
        );
    }
}
