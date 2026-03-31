import * as core from "../core/index.js";
import type * as Phonic from "../api/index.js";
import { ConversationsSocket } from "../api/resources/conversations/client/Socket.js";
import { fromJson } from "../core/json.js";

/** 1006 is the only close code that indicates an unexpected disconnect
 *  worth reconnecting for. All other codes (1000, 4000, 4800, etc.)
 *  are intentional server-side closes. */
const ABNORMAL_CLOSURE = 1006;

/** Server close codes that mean the session is gone — stop retrying. */
const TERMINAL_RECONNECT_CODES = new Set([
    4800, // reconnect session not found / expired
    4801, // reconnect invalid state
]);

const BASE_RECONNECT_DELAY_MS = 500;
const MAX_RECONNECT_DELAY_MS = 5000;

export interface ReconnectableConversationsSocketArgs {
    /** Called on 1006 to create a new socket with reconnect_conv_id. May be async (e.g. fresh auth). */
    createReconnectSocket: (conversationId: string) => core.ReconnectingWebSocket | Promise<core.ReconnectingWebSocket>;
    /** Initial socket for the first connection. */
    socket: core.ReconnectingWebSocket;
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
 * with a terminal close code (4800 session expired, 4801 invalid state)
 * or the user calls close().
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
    private _pendingReconnect: ReturnType<typeof setTimeout> | undefined;
    private _pendingReplacement = false;
    private _nextOpenPromise: Promise<core.ReconnectingWebSocket> | undefined;
    private _resolveNextOpen: ((socket: core.ReconnectingWebSocket) => void) | undefined;
    private _rejectNextOpen: ((err: Error) => void) | undefined;

    constructor(args: ReconnectableConversationsSocketArgs) {
        this._createReconnectSocket = args.createReconnectSocket;
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

    public connect(): never {
        throw new Error("connect() is not supported on ReconnectableConversationsSocket. Reconnection is handled automatically.");
    }

    public close(): void {
        this._isClosed = true;
        this._pendingReplacement = false;
        if (this._pendingReconnect != null) {
            clearTimeout(this._pendingReconnect);
            this._pendingReconnect = undefined;
        }
        if (this._rejectNextOpen) {
            this._rejectNextOpen(new Error("Socket closed during reconnection"));
            this._resolveNextOpen = undefined;
            this._rejectNextOpen = undefined;
            this._nextOpenPromise = undefined;
        }
        this._inner.close();
    }

    public async waitForOpen(): Promise<core.ReconnectingWebSocket> {
        if (this._pendingReplacement) {
            this._nextOpenPromise ??= new Promise<core.ReconnectingWebSocket>((resolve, reject) => {
                this._resolveNextOpen = resolve;
                this._rejectNextOpen = reject;
            });
            return this._nextOpenPromise;
        }
        return this._inner.waitForOpen();
    }

    private _getReconnectDelay(): number {
        // Exponential backoff: 500ms, 1s, 2s, 4s, capped at 5s
        const delay = BASE_RECONNECT_DELAY_MS * Math.pow(2, this._reconnectAttempts - 1);
        return Math.min(delay, MAX_RECONNECT_DELAY_MS);
    }

    /** Schedule a reconnection attempt after backoff delay. */
    private _scheduleReconnect(): void {
        if (this._isClosed || !this._conversationId) {
            return;
        }

        this._reconnectAttempts++;
        const delay = this._getReconnectDelay();
        this._pendingReplacement = true;

        this._pendingReconnect = setTimeout(() => {
            this._pendingReconnect = undefined;
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

            if (this._isClosed) {
                this._pendingReplacement = false;
                newRawSocket.close();
                return;
            }

            const newInner = new ConversationsSocket({ socket: newRawSocket });
            this._inner = newInner;
            this._wireInner(newInner, newRawSocket);
            const ws = await newInner.waitForOpen();
            this._pendingReplacement = false;
            this._resolveNextOpen?.(ws);
            this._resolveNextOpen = undefined;
            this._rejectNextOpen = undefined;
            this._nextOpenPromise = undefined;
        } catch (err) {
            this._pendingReplacement = false;
            // Connection failed — schedule another attempt.
            // The server's grace period (10s) is the natural limit;
            // once it expires, the next attempt will get 4800 and stop.
            this._scheduleReconnect();
        }
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

        rawSocket.addEventListener("close", (event: core.CloseEvent) => {
            if (this._isClosed) {
                return;
            }

            // Terminal server codes — session is gone, stop retrying
            if (TERMINAL_RECONNECT_CODES.has(event.code)) {
                return;
            }

            if (event.code === ABNORMAL_CLOSURE) {
                // Cancel ReconnectingWebSocket's built-in auto-reconnect.
                // _handleClose calls _connect() before notifying listeners,
                // but _connect() awaits _wait() which is async. Calling
                // close() synchronously sets _closeCalled = true, which
                // _connect() checks before opening the new socket.
                rawSocket.close();

                if (this._conversationId) {
                    this._scheduleReconnect();
                }
            }
        });
    }
}
