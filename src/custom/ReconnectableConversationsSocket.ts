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
/** Safety cap: stop retrying if the server is completely unreachable.
 *  In normal operation the server's terminal codes (4800/4801) stop
 *  retries much sooner (within the 10s grace period). */
const MAX_RECONNECT_ATTEMPTS = 10;

export interface ReconnectableConversationsSocketArgs {
    /** Called on 1006 to create a new socket with reconnect_conv_id. May be async (e.g. fresh auth). */
    createReconnectSocket: (conversationId: string) => core.ReconnectingWebSocket | Promise<core.ReconnectingWebSocket>;
    /** Initial socket for the first connection. */
    socket: core.ReconnectingWebSocket;
    /** If provided, reconnection stops when the signal is aborted. */
    abortSignal?: AbortSignal;
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
 * Retries reconnection with exponential backoff until the server responds
 * with a terminal close code (4800 session expired, 4801 invalid state),
 * the safety cap is reached, or the user calls close().
 *
 * Uses composition rather than inheritance to avoid coupling to the parent's
 * private event handler registration or ReconnectingWebSocket internals.
 */
export class ReconnectableConversationsSocket {
    private _conversationId: string | null = null;
    private _inner: ConversationsSocket;
    private readonly _createReconnectSocket: (
        conversationId: string,
    ) => core.ReconnectingWebSocket | Promise<core.ReconnectingWebSocket>;
    private readonly _handlers: EventHandlers = {};
    private _reconnectAttempts = 0;
    private _isClosed = false;
    private readonly _abortSignal: AbortSignal | null;
    private _cleanupWireListeners: (() => void) | null = null;
    private _pendingReconnect: ReturnType<typeof setTimeout> | null = null;
    private _pendingReplacement = false;

    constructor(args: ReconnectableConversationsSocketArgs) {
        this._createReconnectSocket = args.createReconnectSocket;
        this._abortSignal = args.abortSignal != undefined ? args.abortSignal : null;
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

    /** Drop outbound sends when we cannot talk to a live socket (no queue). */
    private _safeSend(op: (inner: ConversationsSocket) => void): void {
        if (this._isClosed || this._pendingReplacement) {
            return;
        }
        if (this._inner.readyState !== core.ReconnectingWebSocket.ReadyState.OPEN) {
            return;
        }
        op(this._inner);
    }

    public sendConfig(message: Phonic.ConfigPayload): void {
        this._safeSend((inner) => inner.sendConfig(message));
    }
    public sendAudioChunk(message: Phonic.AudioChunkPayload): void {
        this._safeSend((inner) => inner.sendAudioChunk(message));
    }
    public sendToolCallOutput(message: Phonic.ToolCallOutputPayload): void {
        this._safeSend((inner) => inner.sendToolCallOutput(message));
    }
    public sendUpdateSystemPrompt(message: Phonic.UpdateSystemPromptPayload): void {
        this._safeSend((inner) => inner.sendUpdateSystemPrompt(message));
    }
    public sendAddSystemMessage(message: Phonic.AddSystemMessagePayload): void {
        this._safeSend((inner) => inner.sendAddSystemMessage(message));
    }
    public sendSetExternalId(message: Phonic.SetExternalIdPayload): void {
        this._safeSend((inner) => inner.sendSetExternalId(message));
    }
    public sendGenerateReply(message: Phonic.GenerateReplyPayload): void {
        this._safeSend((inner) => inner.sendGenerateReply(message));
    }
    public sendSay(message: Phonic.SayPayload): void {
        this._safeSend((inner) => inner.sendSay(message));
    }

    /**
     * Not supported — reconnection after 1006 is handled automatically.
     * To start a new conversation, create a new socket via client.conversations.connect().
     */
    public connect(): never {
        throw new Error(
            "connect() is not supported on ReconnectableConversationsSocket. "
            + "Reconnection after 1006 is automatic. To start a new conversation, "
            + "call client.conversations.connect() again."
        );
    }

    public close(): void {
        this._isClosed = true;
        this._pendingReplacement = false;
        if (this._pendingReconnect != null) {
            clearTimeout(this._pendingReconnect);
            this._pendingReconnect = null;
        }
        this._cleanupWireListeners?.();
        this._cleanupWireListeners = null;
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

    /** Schedule a reconnection attempt after backoff delay. */
    private _scheduleReconnect(): void {
        if (this._isClosed || this._conversationId === null || this._abortSignal?.aborted) {
            return;
        }
        if (this._reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            this._pendingReplacement = false;
            this._handlers.error?.(new Error("Max reconnect attempts reached"));
            return;
        }

        // Clear any existing timer to prevent orphaned timeouts
        if (this._pendingReconnect != null) {
            clearTimeout(this._pendingReconnect);
        }

        this._reconnectAttempts++;
        const delay = this._getReconnectDelay();
        this._pendingReplacement = true;

        this._pendingReconnect = setTimeout(() => {
            this._pendingReconnect = null;
            if (this._isClosed) {
                this._pendingReplacement = false;
                return;
            }
            void this._doReconnect();
        }, delay);
    }

    /** Perform the actual reconnection attempt. */
    private async _doReconnect(): Promise<void> {
        try {
            const created = this._createReconnectSocket(this._conversationId!);
            const newRawSocket = created instanceof Promise ? await created : created;

            if (this._isClosed || this._abortSignal?.aborted) {
                this._pendingReplacement = false;
                newRawSocket.close();
                return;
            }

            // Clean up the old socket: remove our custom listeners and close
            // the ConversationsSocket wrapper (which removes its own listeners).
            this._cleanupWireListeners?.();
            this._cleanupWireListeners = null;
            try { this._inner.close(); } catch { /* already closed from 1006 */ }

            const newInner = new ConversationsSocket({ socket: newRawSocket });
            this._inner = newInner;
            this._wireInner(newInner, newRawSocket);
        } catch {
            this._pendingReplacement = false;
            // Connection failed — schedule another attempt.
            // The server's grace period (10s) is the natural limit;
            // once it expires, the next attempt will get 4800 and stop.
            this._scheduleReconnect();
        }
    }

    private _wireInner(inner: ConversationsSocket, rawSocket: core.ReconnectingWebSocket): void {
        // Forward events from the inner ConversationsSocket to user handlers.
        // Clear _pendingReplacement before calling the user's open handler
        // so that sends inside the handler are not silently dropped.
        inner.on("open", () => {
            this._pendingReplacement = false;
            this._handlers.open?.();
        });
        inner.on("message", (msg) => this._handlers.message?.(msg));
        inner.on("close", (ev) => this._handlers.close?.(ev));
        inner.on("error", (err) => this._handlers.error?.(err));

        // Intercept raw messages to capture conversation_id and reset reconnect counter
        const onMessage = (event: { data: string }) => {
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
        };

        const onClose = (event: core.CloseEvent) => {
            if (this._isClosed) {
                return;
            }

            if (event.code === ABNORMAL_CLOSURE && this._conversationId !== null) {
                // We have a conversation to resume — cancel RWS's built-in
                // auto-reconnect and handle it ourselves with reconnect_conv_id.
                // _handleClose calls _connect() before notifying listeners,
                // but _connect() awaits _wait() which is async. Calling
                // close() synchronously sets _closeCalled = true, which
                // _connect() checks before opening the new socket.
                rawSocket.close();
                this._scheduleReconnect();
            }
            // 1006 without conversationId: let RWS handle transport-level
            // reconnect normally (starts a fresh conversation).
        };

        rawSocket.addEventListener("message", onMessage);
        rawSocket.addEventListener("close", onClose);

        this._cleanupWireListeners = () => {
            rawSocket.removeEventListener("message", onMessage);
            rawSocket.removeEventListener("close", onClose as any);
        };
    }
}
