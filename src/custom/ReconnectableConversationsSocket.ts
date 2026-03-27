import * as core from "../core/index.js";
import type * as Phonic from "../api/index.js";
import { ConversationsSocket } from "../api/resources/conversations/client/Socket.js";
import { fromJson } from "../core/json.js";

/** 1006 is the only close code that indicates an unexpected disconnect
 *  worth reconnecting for. All other codes (1000, 4000, 4800, etc.)
 *  are intentional server-side closes. */
const ABNORMAL_CLOSURE = 1006;

const BASE_RECONNECT_DELAY_MS = 500;
const MAX_RECONNECT_DELAY_MS = 5000;

export interface ReconnectableConversationsSocketArgs {
    /** Called on 1006 to create a new socket with reconnect_conv_id. */
    createReconnectSocket: (conversationId: string) => core.ReconnectingWebSocket;
    /** Initial socket for the first connection. */
    socket: core.ReconnectingWebSocket;
    maxReconnectAttempts?: number;
}

type EventHandlers = {
    open?: () => void;
    message?: (message: ConversationsSocket.Response) => void;
    close?: (event: core.CloseEvent) => void;
    error?: (error: Error) => void;
};

/**
 * Wraps ConversationsSocket with automatic reconnection on 1006.
 *
 * On abnormal closure, creates a brand new ReconnectingWebSocket (via the
 * createReconnectSocket factory) and wraps it in a fresh ConversationsSocket,
 * forwarding all events to user-registered handlers.
 *
 * Uses composition rather than inheritance to avoid coupling to the parent's
 * private event handler registration or ReconnectingWebSocket internals.
 */
export class ReconnectableConversationsSocket {
    private _conversationId: string | null = null;
    private _inner: ConversationsSocket;
    private readonly _createReconnectSocket: (conversationId: string) => core.ReconnectingWebSocket;
    private readonly _maxReconnectAttempts: number;
    private readonly _handlers: EventHandlers = {};
    private _reconnectAttempts = 0;
    private _isClosed = false;
    private _pendingReconnect: ReturnType<typeof setTimeout> | undefined;

    constructor(args: ReconnectableConversationsSocketArgs) {
        this._createReconnectSocket = args.createReconnectSocket;
        this._maxReconnectAttempts = args.maxReconnectAttempts ?? 30;
        this._inner = new ConversationsSocket({ socket: args.socket });
        this._wireInner(this._inner, args.socket);
    }

    /** The conversation ID captured from the server's conversation_created message. */
    get conversationId(): string | null {
        return this._conversationId;
    }

    get socket(): core.ReconnectingWebSocket {
        return this._inner.socket;
    }

    get readyState(): number {
        return this._inner.readyState;
    }

    public on<T extends keyof EventHandlers>(event: T, callback: EventHandlers[T]): void {
        this._handlers[event] = callback;
    }

    public sendConfig(message: any): void { this._inner.sendConfig(message); }
    public sendAudioChunk(message: any): void { this._inner.sendAudioChunk(message); }
    public sendToolCallOutput(message: any): void { this._inner.sendToolCallOutput(message); }
    public sendUpdateSystemPrompt(message: any): void { this._inner.sendUpdateSystemPrompt(message); }
    public sendAddSystemMessage(message: any): void { this._inner.sendAddSystemMessage(message); }
    public sendSetExternalId(message: any): void { this._inner.sendSetExternalId(message); }
    public sendGenerateReply(message: any): void { this._inner.sendGenerateReply(message); }

    public connect(): never {
        throw new Error("connect() is not supported on ReconnectableConversationsSocket. Reconnection is handled automatically.");
    }

    public close(): void {
        this._isClosed = true;
        if (this._pendingReconnect != null) {
            clearTimeout(this._pendingReconnect);
            this._pendingReconnect = undefined;
        }
        this._inner.close();
    }

    public async waitForOpen(): Promise<core.ReconnectingWebSocket> {
        return this._inner.waitForOpen();
    }

    private _getReconnectDelay(): number {
        // Exponential backoff: 500ms, 1s, 2s, 4s, capped at 5s
        const delay = BASE_RECONNECT_DELAY_MS * Math.pow(2, this._reconnectAttempts - 1);
        return Math.min(delay, MAX_RECONNECT_DELAY_MS);
    }

    private _wireInner(inner: ConversationsSocket, rawSocket: core.ReconnectingWebSocket): void {
        // Forward events from the inner ConversationsSocket to user handlers
        inner.on("open", () => this._handlers.open?.());
        inner.on("message", (msg) => this._handlers.message?.(msg));
        inner.on("close", (ev) => this._handlers.close?.(ev));
        inner.on("error", (err) => this._handlers.error?.(err));

        // Intercept raw messages to capture conversation_id and reset reconnect counter
        rawSocket.addEventListener("message", (event: { data: string }) => {
            try {
                const data = fromJson(event.data);
                if (data && typeof data === "object" && "type" in data) {
                    const type = (data as { type: string }).type;
                    if (type === "conversation_created") {
                        this._conversationId = (data as Phonic.ConversationCreatedPayload).conversation_id;
                    }
                    if (type === "conversation_reconnected") {
                        this._reconnectAttempts = 0;
                    }
                }
            } catch {
                // ignore — inner socket handles parse errors
            }
        });

        // On 1006, wait briefly (exponential backoff) then create a new socket.
        // The delay gives the network/proxy time to recover before we attempt
        // to connect the new socket.
        rawSocket.addEventListener("close", (event: core.CloseEvent) => {
            if (this._isClosed) {
                return;
            }
            if (event.code !== ABNORMAL_CLOSURE) {
                return;
            }
            if (!this._conversationId) {
                return;
            }
            if (this._reconnectAttempts >= this._maxReconnectAttempts) {
                return;
            }

            this._reconnectAttempts++;
            const delay = this._getReconnectDelay();

            this._pendingReconnect = setTimeout(() => {
                this._pendingReconnect = undefined;
                if (this._isClosed) {
                    return;
                }
                const newRawSocket = this._createReconnectSocket(this._conversationId!);
                const newInner = new ConversationsSocket({ socket: newRawSocket });
                this._inner = newInner;
                this._wireInner(newInner, newRawSocket);
            }, delay);
        });
    }
}
