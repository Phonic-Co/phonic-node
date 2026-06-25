// Maintained manually (listed in .fernignore). Fern does not overwrite this file.

import * as Phonic from "./api/index.js";
import { AgentsClient } from "./api/resources/agents/client/Client.js";
import { ApiKeysClient } from "./api/resources/apiKeys/client/Client.js";
import { AuthClient } from "./api/resources/auth/client/Client.js";
import { ConversationItemsClient } from "./api/resources/conversationItems/client/Client.js";
import { ConversationsClient } from "./api/resources/conversations/client/Client.js";
import { ExtractionSchemasClient } from "./api/resources/extractionSchemas/client/Client.js";
import { ProjectsClient } from "./api/resources/projects/client/Client.js";
import { ToolsClient } from "./api/resources/tools/client/Client.js";
import { TtsClient } from "./api/resources/tts/client/Client.js";
import { VoicesClient } from "./api/resources/voices/client/Client.js";
import { WorkspaceClient } from "./api/resources/workspace/client/Client.js";
import type { BaseClientOptions, BaseRequestOptions } from "./BaseClient.js";
import { type NormalizedClientOptionsWithAuth, normalizeClientOptionsWithAuth } from "./BaseClient.js";
import { mergeHeaders } from "./core/headers.js";
import * as core from "./core/index.js";
import * as environments from "./environments.js";
import { handleNonStatusCodeError } from "./errors/handleNonStatusCodeError.js";
import * as errors from "./errors/index.js";

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
    protected _apiKeys: ApiKeysClient | undefined;
    protected _tools: ToolsClient | undefined;
    protected _extractionSchemas: ExtractionSchemasClient | undefined;
    protected _tts: TtsClient | undefined;
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

    public get apiKeys(): ApiKeysClient {
        return (this._apiKeys ??= new ApiKeysClient(this._options));
    }

    public get tools(): ToolsClient {
        return (this._tools ??= new ToolsClient(this._options));
    }

    public get extractionSchemas(): ExtractionSchemasClient {
        return (this._extractionSchemas ??= new ExtractionSchemasClient(this._options));
    }

    public get tts(): TtsClient {
        return (this._tts ??= new TtsClient(this._options));
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
     * Deletes a conversation, scheduling its transcripts and audio recordings for deletion. The conversation must have ended.
     *
     * @param {string} id - The ID of the conversation to delete.
     * @param {PhonicClient.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Phonic.UnauthorizedError}
     * @throws {@link Phonic.ForbiddenError}
     * @throws {@link Phonic.NotFoundError}
     * @throws {@link Phonic.ConflictError}
     * @throws {@link Phonic.InternalServerError}
     *
     * @example
     *     await client.deleteConversationsId("id")
     */
    public deleteConversationsId(
        id: string,
        requestOptions?: PhonicClient.RequestOptions,
    ): core.HttpResponsePromise<Phonic.DeleteConversationsIdResponse> {
        return core.HttpResponsePromise.fromPromise(this.__deleteConversationsId(id, requestOptions));
    }

    private async __deleteConversationsId(
        id: string,
        requestOptions?: PhonicClient.RequestOptions,
    ): Promise<core.WithRawResponse<Phonic.DeleteConversationsIdResponse>> {
        const _authRequest: core.AuthRequest = await this._options.authProvider.getAuthRequest();
        const _headers: core.Fetcher.Args["headers"] = mergeHeaders(
            _authRequest.headers,
            this._options?.headers,
            requestOptions?.headers,
        );
        const _response = await (this._options.fetcher ?? core.fetcher)({
            url: core.url.join(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    ((await core.Supplier.get(this._options.environment)) ?? environments.PhonicEnvironment.Default)
                        .base,
                `conversations/${core.url.encodePathParam(id)}`,
            ),
            method: "DELETE",
            headers: _headers,
            queryParameters: requestOptions?.queryParams,
            timeoutMs: (requestOptions?.timeoutInSeconds ?? this._options?.timeoutInSeconds ?? 60) * 1000,
            maxRetries: requestOptions?.maxRetries ?? this._options?.maxRetries,
            abortSignal: requestOptions?.abortSignal,
            fetchFn: this._options?.fetch,
            logging: this._options.logging,
        });
        if (_response.ok) {
            return { data: _response.body as Phonic.DeleteConversationsIdResponse, rawResponse: _response.rawResponse };
        }

        if (_response.error.reason === "status-code") {
            switch (_response.error.statusCode) {
                case 401:
                    throw new Phonic.UnauthorizedError(
                        _response.error.body as Phonic.BasicError,
                        _response.rawResponse,
                    );
                case 403:
                    throw new Phonic.ForbiddenError(_response.error.body as unknown, _response.rawResponse);
                case 404:
                    throw new Phonic.NotFoundError(_response.error.body as unknown, _response.rawResponse);
                case 409:
                    throw new Phonic.ConflictError(_response.error.body as unknown, _response.rawResponse);
                case 500:
                    throw new Phonic.InternalServerError(
                        _response.error.body as Phonic.BasicError,
                        _response.rawResponse,
                    );
                default:
                    throw new errors.PhonicError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.body,
                        rawResponse: _response.rawResponse,
                    });
            }
        }

        return handleNonStatusCodeError(_response.error, _response.rawResponse, "DELETE", "/conversations/{id}");
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
