import * as core from "../core/index.js";
import * as environments from "../environments.js";
import { ConversationsClient } from "../api/resources/conversations/client/Client.js";
import { ConversationsSocket } from "../api/resources/conversations/client/Socket.js";
import { PhonicClient } from "../Client.js";
import { ReconnectableConversationsSocket } from "./ReconnectableConversationsSocket.js";

class ReconnectableConversationsClient extends ConversationsClient {
    /**
     * Connect with automatic session-aware reconnection on 1006.
     *
     * Returns a ReconnectableConversationsSocket which has the same API as
     * ConversationsSocket but automatically reconnects with the correct
     * reconnect_conv_id when the connection drops unexpectedly.
     */
    public override async connect(
        args: ConversationsClient.ConnectArgs = {},
    ): Promise<ConversationsSocket> {
        const {
            downstream_websocket_url: downstreamWebsocketUrl,
            queryParams,
            headers,
            debug,
            reconnectAttempts,
            connectionTimeoutInSeconds,
            abortSignal,
        } = args;
        const _queryParams: Record<string, unknown> = {
            downstream_websocket_url: downstreamWebsocketUrl,
        };
        const _headers: Record<string, unknown> = { ...headers };

        const baseWsUrl = core.url.join(
            (await core.Supplier.get(this._options.baseUrl)) ??
                ((await core.Supplier.get(this._options.environment)) ?? environments.PhonicEnvironment.Default)
                    .production,
            "/v1/sts/ws",
        );

        const socketOptions = {
            protocols: [] as string[],
            queryParameters: { ..._queryParams, ...queryParams },
            headers: _headers,
            options: {
                debug: debug ?? false,
                // Disable built-in auto-reconnect. Session-aware reconnection
                // is managed by ReconnectableConversationsSocket, which creates
                // new sockets with reconnect_conv_id.
                maxRetries: 0,
                connectionTimeout: connectionTimeoutInSeconds != null ? connectionTimeoutInSeconds * 1000 : undefined,
            },
            abortSignal,
        };

        const createSocket = (reconnectConvId?: string): core.ReconnectingWebSocket => {
            return new core.ReconnectingWebSocket({
                ...socketOptions,
                url: baseWsUrl,
                queryParameters: {
                    ...socketOptions.queryParameters,
                    ...(reconnectConvId ? { reconnect_conv_id: reconnectConvId } : {}),
                },
            });
        };

        const initialSocket = createSocket();

        // ReconnectableConversationsSocket is not a subclass of ConversationsSocket
        // (it uses composition to avoid coupling to private internals), but it
        // exposes the same public API. Cast to satisfy the override return type.
        return new ReconnectableConversationsSocket({
            socket: initialSocket,
            createReconnectSocket: (conversationId) => createSocket(conversationId),
            maxReconnectAttempts: reconnectAttempts ?? 30,
        }) as unknown as ConversationsSocket;
    }
}

export class ReconnectablePhonicClient extends PhonicClient {
    private _reconnectableConversations: ReconnectableConversationsClient | undefined;

    public override get conversations(): ReconnectableConversationsClient {
        return (this._reconnectableConversations ??= new ReconnectableConversationsClient(this._options));
    }
}
