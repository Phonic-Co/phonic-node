import { ReconnectingWebSocket, CloseEvent } from "../src/core/websocket/ws";
import { ReconnectableConversationsSocket } from "../src/custom/ReconnectableConversationsSocket";

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

    it.each([1000, 4000, 4303])(
        "does NOT create a new socket on non-1006 close code %i",
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

            // The reconnect socket gets a terminal close code
            const reconnectSocket = createReconnectSocket.mock.results[0].value;
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
