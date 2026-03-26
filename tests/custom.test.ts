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
        jest.advanceTimersByTime(1000); // advance past reconnect delay

        expect(createReconnectSocket).toHaveBeenCalledWith("conv_123");
    });

    it("does NOT create a new socket on 1006 when no conversation_id", () => {
        const { mockSocket, createReconnectSocket } = createSocket();

        mockSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(1000);

        expect(createReconnectSocket).not.toHaveBeenCalled();
    });

    it.each([1000, 4000, 4800, 4801, 4303])(
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

    it("respects maxReconnectAttempts", () => {
        const mockSocket = createMockSocket();
        const createReconnectSocket = jest.fn(() => createMockSocket() as unknown as ReconnectingWebSocket);
        new ReconnectableConversationsSocket({
            socket: mockSocket as unknown as ReconnectingWebSocket,
            createReconnectSocket,
            maxReconnectAttempts: 1,
        });

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        // First 1006 — should reconnect
        mockSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(1000);
        expect(createReconnectSocket).toHaveBeenCalledTimes(1);

        // Second 1006 on original socket — should NOT reconnect (exceeded max)
        mockSocket._fire("close", { code: 1006 });
        jest.advanceTimersByTime(10000);
        expect(createReconnectSocket).toHaveBeenCalledTimes(1);
    });

    it("close() cancels pending reconnect timer", () => {
        const { mockSocket, reconnectable, createReconnectSocket } = createSocket();

        mockSocket._fire("message", {
            data: JSON.stringify({ type: "conversation_created", conversation_id: "conv_123" }),
        });

        // Trigger 1006 — starts backoff timer
        mockSocket._fire("close", { code: 1006 });

        // Close before the timer fires
        reconnectable.close();
        jest.advanceTimersByTime(10000);

        // Should NOT have created a reconnect socket
        expect(createReconnectSocket).not.toHaveBeenCalled();
    });
});
