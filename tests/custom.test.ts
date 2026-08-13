import { ReconnectingWebSocket, CloseEvent } from "../src/core/websocket/ws";
import { ReconnectableConversationsSocket } from "../src/custom/ReconnectableConversationsSocket";

// Mirrors the constants in ReconnectableConversationsSocket (not exported).
const MAX_RECONNECT_DELAY_MS = 5000;
const MAX_RECONNECT_ATTEMPTS = 10;

// Minimal mock of ReconnectingWebSocket
function createMockSocket() {
    const listeners: Record<string, Array<(event: any) => void>> = {};
    return {
        addEventListener: jest.fn((type: string, listener: (event: any) => void) => {
            listeners[type] = listeners[type] || [];
            listeners[type].push(listener);
        }),
        removeEventListener: jest.fn(),
        close: jest.fn(),
        send: jest.fn(),
        reconnect: jest.fn(),
        readyState: 1, // OPEN
        get CONNECTING() { return 0; },
        get OPEN() { return 1; },
        get CLOSING() { return 2; },
        get CLOSED() { return 3; },
        binaryType: "blob" as BinaryType,
        bufferedAmount: 0,
        extensions: "",
        protocol: "",
        url: "",
        onopen: null,
        onclose: null,
        onmessage: null,
        onerror: null,
        retryCount: 0,
        dispatchEvent: jest.fn(),
        _fire(type: string, event: any) {
            for (const listener of listeners[type] || []) {
                listener(event);
            }
        },
        _listeners: listeners,
    } as unknown as ReconnectingWebSocket & { _fire: (type: string, event: any) => void };
}

function createSocket() {
    const mockSocket = createMockSocket();
    const createReconnectSocket = jest.fn(() => createMockSocket() as unknown as ReconnectingWebSocket);
    const reconnectable = new ReconnectableConversationsSocket({
        socket: mockSocket as unknown as ReconnectingWebSocket,
        createReconnectSocket,
    });
    return { mockSocket, reconnectable, createReconnectSocket };
}

describe("ReconnectableConversationsSocket", () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("captures conversation_id from conversation_created message", () => {
        const { mockSocket, reconnectable } = createSocket();

        expect(reconnectable.conversationId).toBeNull();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        expect(reconnectable.conversationId).toBe("conv_123");
    });

    it("does not capture conversation_id from other message types", () => {
        const { mockSocket, reconnectable } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "audio_chunk", audio: "base64data" }),
        });

        expect(reconnectable.conversationId).toBeNull();
    });

    it("handles message without type field gracefully", () => {
        const { mockSocket, reconnectable } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ some: "other data" }),
        });

        expect(reconnectable.conversationId).toBeNull();
    });

    it("creates a new socket on 1006 when conversation_id is captured", () => {
        const { mockSocket, createReconnectSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        mockSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(1000);

        expect(createReconnectSocket).toHaveBeenCalledWith("conv_123");
    });

    it("creates a new socket on 1012 (service restart) when conversation_id is captured", () => {
        const { mockSocket, createReconnectSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        mockSocket._fire("close", { code: 1012, reason: "restarting" });
        jest.advanceTimersByTime(1000);

        expect(createReconnectSocket).toHaveBeenCalledWith("conv_123");
    });

    it("creates a new socket on 1001 when reason is restarting", () => {
        const { mockSocket, createReconnectSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        mockSocket._fire("close", { code: 1001, reason: "restarting" });
        jest.advanceTimersByTime(1000);

        expect(createReconnectSocket).toHaveBeenCalledWith("conv_123");
    });

    it("does NOT create a new socket on a bare 1001 (going away — user closed/ended)", () => {
        const { mockSocket, createReconnectSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        mockSocket._fire("close", { code: 1001, reason: "" });
        jest.advanceTimersByTime(10000);

        expect(createReconnectSocket).not.toHaveBeenCalled();
    });

    it("cancels RWS auto-reconnect on 1006 by calling close()", () => {
        const { mockSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        mockSocket._fire("close", { code: 1006 });

        // close() should be called on the raw socket to cancel RWS auto-reconnect
        expect(mockSocket.close).toHaveBeenCalled();
    });

    it("does NOT create a new socket on 1006 when no conversation_id", () => {
        const { mockSocket, createReconnectSocket } = createSocket();

        mockSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(1000);

        expect(createReconnectSocket).not.toHaveBeenCalled();
    });

    // Real close codes observed in production (BetterStack) — every code the
    // backend actually emits, except the reconnectable ones (1006/1012/
    // 1001-"restarting"), must NOT trigger a reconnect.
    it.each<[number, string]>([
        [1000, "normal closure"],
        [1001, "going away — bare (user/caller ended)"],
        [1005, "no status received"],
        [1011, "server internal error"],
        [4000, "downstream websocket closed"],
        [4004, "insufficient capacity"],
        [4010, "concurrency limit reached"],
        [4200, "end conversation clicked"],
        [4500, "no input received timeout"],
        [4600, "assistant ended conversation"],
        [4700, "component unmounted"],
    ])(
        "does NOT create a new socket on non-reconnectable close code %i (%s)",
        (code) => {
            const { mockSocket, createReconnectSocket } = createSocket();

            mockSocket._fire("message", {
                data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
            });

            mockSocket._fire("close", { code });
            jest.advanceTimersByTime(10000);

            expect(createReconnectSocket).not.toHaveBeenCalled();
        },
    );

    it.each([4800, 4801])(
        "stops retrying on terminal server code %i",
        (code) => {
            const { mockSocket, createReconnectSocket } = createSocket();

            mockSocket._fire("message", {
                data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
            });

            // Simulate: 1006 → reconnect socket created → server responds with terminal code
            mockSocket._fire("close", { code: 1006 });
            jest.advanceTimersByTime(1000);
            expect(createReconnectSocket).toHaveBeenCalledTimes(1);

            // The reconnect socket connects, then gets a terminal close code.
            // The open matters: a server-sent code can only follow a handshake.
            const reconnectSocket = createReconnectSocket.mock.results[0].value;
            reconnectSocket._fire("open", {});
            reconnectSocket._fire("close", { code });
            jest.advanceTimersByTime(10000);

            // Should NOT have created another socket
            expect(createReconnectSocket).toHaveBeenCalledTimes(1);
        },
    );

    it("uses exponential backoff delay before reconnecting", () => {
        const { mockSocket, createReconnectSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        // First 1006 — delay should be 500ms
        mockSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(499);
        expect(createReconnectSocket).not.toHaveBeenCalled();
        jest.advanceTimersByTime(1);
        expect(createReconnectSocket).toHaveBeenCalledTimes(1);
    });

    it("resets reconnect counter on successful reconnection", () => {
        const { mockSocket, createReconnectSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        // First 1006 — reconnects
        mockSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(1000);
        expect(createReconnectSocket).toHaveBeenCalledTimes(1);

        // Simulate conversation_reconnected on the new socket
        const newSocket = createReconnectSocket.mock.results[0].value;
        newSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_reconnected" }),
        });

        // Second 1006 on new socket — delay should be 500ms again (reset)
        newSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(499);
        expect(createReconnectSocket).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(1);
        expect(createReconnectSocket).toHaveBeenCalledTimes(2);
    });

    it("retries reconnection on failure", () => {
        const mockSocket = createMockSocket();
        let callCount = 0;
        const createReconnectSocket = jest.fn(() => {
            callCount++;
            if (callCount === 1) {
                // First attempt fails
                throw new Error("Connection failed");
            }
            return createMockSocket() as unknown as ReconnectingWebSocket;
        });
        new ReconnectableConversationsSocket({
            socket: mockSocket as unknown as ReconnectingWebSocket,
            createReconnectSocket,
        });

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        // First 1006 → first attempt (fails)
        mockSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(500);
        expect(createReconnectSocket).toHaveBeenCalledTimes(1);

        // Should schedule another attempt after backoff
        jest.advanceTimersByTime(1000);
        expect(createReconnectSocket).toHaveBeenCalledTimes(2);
    });

    it("drops sends during reconnect backoff without throwing", () => {
        const { mockSocket, reconnectable } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        mockSocket._fire("close", { code: 1006 });
        mockSocket.readyState = 3; // CLOSED

        expect(() =>
            reconnectable.sendAudioChunk({ type: "audio_chunk", audio: "dGVzdA==" } as any),
        ).not.toThrow();
        expect(() => reconnectable.sendConfig({ type: "config", agent: "a" } as any)).not.toThrow();
    });

    // The drop must be invisible to the user while we recover from it — the
    // Python SDK's recv() swallows a reconnectable ConnectionClosed the same
    // way. Callers that treat "close" as end-of-session (the LiveKit agents
    // plugin tears down the whole AgentSession on any non-1000 close) would
    // otherwise kill the session during our backoff, defeating the reconnect.
    describe("close event exposure", () => {
        function withHandlers() {
            const ctx = createSocket();
            const onClose = jest.fn();
            const onError = jest.fn();
            const onOpen = jest.fn();
            ctx.reconnectable.on("close", onClose);
            ctx.reconnectable.on("error", onError);
            ctx.reconnectable.on("open", onOpen);
            ctx.mockSocket._fire("message", {
                data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
            });
            return { ...ctx, onClose, onError, onOpen };
        }

        it.each<[number, string]>([
            [1006, ""],
            [1012, "restarting"],
            [1001, "restarting"],
        ])("does NOT forward a reconnectable close (%i %s) to the user handler", (code, reason) => {
            const { mockSocket, onClose, createReconnectSocket } = withHandlers();

            mockSocket._fire("close", { code, reason });
            jest.advanceTimersByTime(1000);

            expect(createReconnectSocket).toHaveBeenCalledWith("conv_123");
            expect(onClose).not.toHaveBeenCalled();
        });

        it.each<[number, string]>([
            [1000, "normal closure"],
            [1001, "bare going away"],
            [4000, "downstream websocket closed"],
            [4200, "end conversation clicked"],
            [4600, "assistant ended conversation"],
        ])("forwards a non-reconnectable close (%i %s) immediately", (code) => {
            const { mockSocket, onClose } = withHandlers();

            mockSocket._fire("close", { code, reason: "" });

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose.mock.calls[0][0]).toMatchObject({ code });
        });

        it("forwards a reconnectable close when there is no conversation to resume", () => {
            const { mockSocket, reconnectable } = createSocket();
            const onClose = jest.fn();
            reconnectable.on("close", onClose);

            // No conversation_created — nothing to resume, so RWS handles the
            // transport-level reconnect and the close is the user's business.
            mockSocket._fire("close", { code: 1006, reason: "" });

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it("stays silent across a full drop-and-recover cycle", () => {
            const { mockSocket, createReconnectSocket, onClose, onError, onOpen } = withHandlers();

            mockSocket._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(1000);

            const newSocket = createReconnectSocket.mock.results[0].value;
            newSocket._fire("open", {});
            newSocket._fire("message", { data: JSON.stringify({ type: "conversation_reconnected" }) });

            expect(onOpen).toHaveBeenCalledTimes(1);
            expect(onClose).not.toHaveBeenCalled();
            expect(onError).not.toHaveBeenCalled();
        });

        // ConversationsSocket.close() synthesizes a {code: 1000} close event, and
        // _doReconnect() closes the superseded socket on every attempt — so the
        // discarded wrapper must be detached first or each reconnect reports a
        // phantom normal closure.
        it("does not leak a 1000 from the socket discarded during reconnect", () => {
            const { mockSocket, createReconnectSocket, onClose } = withHandlers();

            mockSocket._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(1000);

            expect(createReconnectSocket).toHaveBeenCalledTimes(1);
            expect(onClose).not.toHaveBeenCalled();
        });

        it("still reports a close when the user calls close()", () => {
            const { reconnectable, onClose } = withHandlers();

            reconnectable.close();

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose.mock.calls[0][0]).toMatchObject({ code: 1000 });
        });

        it("surfaces a terminal server code that ends the retry loop", () => {
            const { mockSocket, createReconnectSocket, onClose } = withHandlers();

            mockSocket._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(1000);
            expect(onClose).not.toHaveBeenCalled();

            // Server accepts the connection, then refuses the resume.
            const newSocket = createReconnectSocket.mock.results[0].value;
            newSocket._fire("open", {});
            newSocket._fire("close", { code: 4800, reason: "session expired" });

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose.mock.calls[0][0]).toMatchObject({ code: 4800 });
        });

        it("replays the suppressed close once max reconnect attempts are exhausted", () => {
            const { mockSocket, createReconnectSocket, onClose, onError } = withHandlers();

            // MAX_RECONNECT_ATTEMPTS is 10, so the 11th drop is the one that
            // gives up. Every drop before it must stay hidden.
            let current: any = mockSocket;
            for (let i = 0; i < MAX_RECONNECT_ATTEMPTS; i++) {
                current._fire("close", { code: 1006, reason: "" });
                jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);
                expect(createReconnectSocket).toHaveBeenCalledTimes(i + 1);
                expect(onClose).not.toHaveBeenCalled();
                // Each replacement connects, then drops again.
                current = createReconnectSocket.mock.results[i].value;
                current._fire("open", {});
            }

            current._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);

            // No 11th socket, and the drop finally reaches the user — with the
            // real close code, not a synthesized one.
            expect(createReconnectSocket).toHaveBeenCalledTimes(MAX_RECONNECT_ATTEMPTS);
            expect(onError).toHaveBeenCalledWith(new Error("Max reconnect attempts reached"));
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose.mock.calls[0][0]).toMatchObject({ code: 1006 });
        });

        it("becomes a plain pass-through after giving up", () => {
            const { mockSocket, createReconnectSocket, onClose, onError } = withHandlers();

            let current: any = mockSocket;
            for (let i = 0; i < MAX_RECONNECT_ATTEMPTS; i++) {
                current._fire("close", { code: 1006, reason: "" });
                jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);
                current = createReconnectSocket.mock.results[i].value;
                current._fire("open", {});
            }
            current._fire("close", { code: 1006, reason: "" });
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledTimes(1);

            // A late close from the abandoned socket forwards straight through
            // — no fresh attempt, and the give-up error is not repeated.
            current._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);

            expect(createReconnectSocket).toHaveBeenCalledTimes(MAX_RECONNECT_ATTEMPTS);
            expect(onError).toHaveBeenCalledTimes(1);
            expect(onClose).toHaveBeenCalledTimes(2);
        });

        // Replacement sockets are created with maxRetries: 0, and RWS reports a
        // connect error or timeout as a *synthesized* {code: 1000} rather than
        // the underlying 1006 (_handleError -> _disconnect defaults to 1000).
        // A failed attempt must therefore not be mistaken for a normal closure.
        it("retries when a replacement never opens and reports 1000", () => {
            const { mockSocket, createReconnectSocket, onClose } = withHandlers();

            mockSocket._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);
            expect(createReconnectSocket).toHaveBeenCalledTimes(1);

            // Server unreachable: RWS synthesizes a normal closure without ever
            // having opened the socket.
            createReconnectSocket.mock.results[0].value._fire("close", { code: 1000, reason: "" });

            expect(onClose).not.toHaveBeenCalled();
            jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);
            expect(createReconnectSocket).toHaveBeenCalledTimes(2);
        });

        it("reports the original drop, not the synthesized 1000, after exhausting retries", () => {
            const { mockSocket, createReconnectSocket, onClose, onError } = withHandlers();

            mockSocket._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);

            for (let i = 0; i < MAX_RECONNECT_ATTEMPTS; i++) {
                createReconnectSocket.mock.results[i].value._fire("close", { code: 1000, reason: "" });
                jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);
            }

            expect(createReconnectSocket).toHaveBeenCalledTimes(MAX_RECONNECT_ATTEMPTS);
            expect(onError).toHaveBeenCalledWith(new Error("Max reconnect attempts reached"));
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose.mock.calls[0][0]).toMatchObject({ code: 1006 });
        });

        it("still surfaces a terminal code from a replacement that opened", () => {
            const { mockSocket, createReconnectSocket, onClose } = withHandlers();

            mockSocket._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);

            // Handshake succeeded, then the server refused the resume.
            const replacement = createReconnectSocket.mock.results[0].value;
            replacement._fire("open", {});
            replacement._fire("close", { code: 4800, reason: "session expired" });

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose.mock.calls[0][0]).toMatchObject({ code: 4800 });
            expect(createReconnectSocket).toHaveBeenCalledTimes(1);
        });

        it("does not emit a close after the user closes from their error handler", () => {
            const { mockSocket, createReconnectSocket, reconnectable, onClose } = withHandlers();
            reconnectable.on("error", () => reconnectable.close());

            mockSocket._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);
            for (let i = 0; i < MAX_RECONNECT_ATTEMPTS; i++) {
                createReconnectSocket.mock.results[i].value._fire("close", { code: 1000, reason: "" });
                jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);
            }

            // The user's close is still reported; replaying the suppressed 1006
            // afterwards would contradict it.
            const codes = onClose.mock.calls.map((c: any[]) => c[0].code);
            expect(codes).toEqual([1000]);
        });

        it("reports the user's close made while a replacement is still connecting", () => {
            const { mockSocket, createReconnectSocket, reconnectable, onClose } = withHandlers();

            mockSocket._fire("close", { code: 1006, reason: "" });
            jest.advanceTimersByTime(MAX_RECONNECT_DELAY_MS);
            expect(createReconnectSocket).toHaveBeenCalledTimes(1);

            // Replacement has not opened yet, so its synthesized 1000 must not
            // be mistaken for a failed attempt and swallowed.
            reconnectable.close();

            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose.mock.calls[0][0]).toMatchObject({ code: 1000 });
        });

        it("gives up and surfaces the close when the abort signal fires mid-backoff", () => {
            const controller = new AbortController();
            const mockSocket = createMockSocket();
            const createReconnectSocket = jest.fn(
                () => createMockSocket() as unknown as ReconnectingWebSocket,
            );
            const reconnectable = new ReconnectableConversationsSocket({
                socket: mockSocket as unknown as ReconnectingWebSocket,
                createReconnectSocket,
                abortSignal: controller.signal,
            });
            const onClose = jest.fn();
            reconnectable.on("close", onClose);
            mockSocket._fire("message", {
                data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
            });

            mockSocket._fire("close", { code: 1006, reason: "" });
            expect(onClose).not.toHaveBeenCalled();

            controller.abort();
            jest.advanceTimersByTime(1000);

            expect(createReconnectSocket).not.toHaveBeenCalled();
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(onClose.mock.calls[0][0]).toMatchObject({ code: 1006 });
        });
    });

    it("close() cancels pending reconnect timer", () => {
        const { mockSocket, reconnectable, createReconnectSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        mockSocket._fire("close", { code: 1006 });
        reconnectable.close();
        jest.advanceTimersByTime(10000);

        expect(createReconnectSocket).not.toHaveBeenCalled();
    });
});
