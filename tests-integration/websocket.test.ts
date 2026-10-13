// Maintained manually (listed in .fernignore). Fern does not overwrite this file.
//
// Live WebSocket integration test. Opens a real conversation WebSocket, sends a
// `config` message and waits for the server's `conversation_created` event.
// This guards the hand-maintained `conversations.connect()` / `ConversationsSocket`
// code (both `.fernignore`-protected) against regressions.

import type { ConversationsSocket } from "../src/api/resources/conversations/client/Socket";
import type { PhonicClient } from "../src/Client";
import { createClient, describeIntegration, uniqueName } from "./helpers";

const TIMEOUT_MS = 60_000;

describeIntegration("Conversation WebSocket (live)", () => {
    let client: PhonicClient;
    let projectName: string;
    let agentName: string;

    beforeAll(async () => {
        client = createClient();
        projectName = uniqueName("proj");
        agentName = uniqueName("agent");
        await client.projects.create({ name: projectName });
        await client.agents.create({
            project: projectName,
            name: agentName,
            phone_number: null,
            system_prompt: "You are a helpful test agent for the SDK CI WebSocket test.",
        });
    }, TIMEOUT_MS);

    afterAll(async () => {
        await client.agents.delete(agentName, { project: projectName }).catch(() => {
            /* best-effort cleanup */
        });
        await client.projects.delete(projectName).catch(() => {
            /* best-effort cleanup */
        });
    }, TIMEOUT_MS);

    it(
        "connects, sends config and receives conversation_created",
        async () => {
            const socket = await client.conversations.connect();

            try {
                const conversationId = await runConversation(socket, {
                    agentName,
                    projectName,
                });
                expect(typeof conversationId).toBe("string");
                expect(conversationId.length).toBeGreaterThan(0);
            } finally {
                socket.close();
            }
        },
        TIMEOUT_MS,
    );
});

/**
 * Waits for the socket to open, sends `config`, and resolves with the
 * `conversation_id` from the `conversation_created` message. Rejects on socket
 * error, an `error`-type message, or early close.
 */
function runConversation(
    socket: ConversationsSocket,
    opts: { agentName: string; projectName: string },
): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let settled = false;

        const finish = (fn: () => void) => {
            if (settled) {
                return;
            }
            settled = true;
            fn();
        };

        socket.on("error", (err) => finish(() => reject(err)));

        socket.on("close", (event) => {
            finish(() => reject(new Error(`Socket closed before conversation_created (code ${event?.code})`)));
        });

        socket.on("message", (message) => {
            if (message.type === "conversation_created") {
                finish(() => resolve(message.conversation_id));
            } else if (message.type === "error") {
                finish(() => reject(new Error(`Server error message: ${JSON.stringify(message)}`)));
            }
        });

        socket
            .waitForOpen()
            .then(() => {
                socket.sendConfig({
                    type: "config",
                    project: opts.projectName,
                    agent: opts.agentName,
                });
            })
            .catch((err) => finish(() => reject(err)));
    });
}
