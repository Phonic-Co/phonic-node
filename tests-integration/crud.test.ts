// Maintained manually (listed in .fernignore). Fern does not overwrite this file.
//
// Live CRUD integration tests. These exercise the real REST surface of the SDK
// against a running Phonic API so that Fern regenerations (and `.fernignore`
// overrides) can't silently break request/response shapes, URLs, or auth.

import type { PhonicClient } from "../src/Client";
import { createClient, describeIntegration, uniqueName, uniqueToolName } from "./helpers";

const TIMEOUT_MS = 60_000;

describeIntegration("SDK REST CRUD (live)", () => {
    let client: PhonicClient;

    // A project shared by the agents/tools suites. Created once, torn down last.
    let sharedProjectName: string;

    beforeAll(async () => {
        client = createClient();
        sharedProjectName = uniqueName("proj");
        await client.projects.create({ name: sharedProjectName });
    }, TIMEOUT_MS);

    afterAll(async () => {
        if (sharedProjectName) {
            await client.projects.delete(sharedProjectName).catch(() => {
                /* best-effort cleanup */
            });
        }
    }, TIMEOUT_MS);

    describe("workspace", () => {
        it(
            "gets the current workspace",
            async () => {
                const workspace = await client.workspace.get();
                expect(typeof workspace.active_conversations).toBe("number");
                expect(typeof workspace.max_active_conversations).toBe("number");
                expect(Array.isArray(workspace.ip_allowlist)).toBe(true);
                expect(Array.isArray(workspace.invite_link_allowed_domains)).toBe(true);
            },
            TIMEOUT_MS,
        );
    });

    describe("projects", () => {
        it(
            "creates, reads, lists, updates and deletes a project",
            async () => {
                const name = uniqueName("proj");
                let created = false;

                try {
                    const createRes = await client.projects.create({ name });
                    created = true;
                    expect(createRes.name).toBe(name);
                    expect(typeof createRes.id).toBe("string");

                    const getRes = await client.projects.get(name);
                    expect(getRes.project.name).toBe(name);
                    expect(getRes.project.id).toBe(createRes.id);

                    const listRes = await client.projects.list();
                    expect(Array.isArray(listRes.projects)).toBe(true);
                    expect(listRes.projects.some((p) => p.name === name)).toBe(true);

                    const updateRes = await client.projects.update(name, {
                        max_active_conversations: 5,
                    });
                    expect(updateRes).toBeDefined();

                    const afterUpdate = await client.projects.get(name);
                    expect(afterUpdate.project.max_active_conversations).toBe(5);
                } finally {
                    if (created) {
                        await client.projects.delete(name);
                    }
                }
            },
            TIMEOUT_MS,
        );
    });

    describe("agents", () => {
        it(
            "creates, reads, lists, updates and deletes an agent",
            async () => {
                const name = uniqueName("agent");
                let created = false;

                try {
                    const createRes = await client.agents.create({
                        project: sharedProjectName,
                        name,
                        phone_number: null,
                        system_prompt: "You are a helpful test agent.",
                    });
                    created = true;
                    expect(createRes.name).toBe(name);
                    expect(typeof createRes.id).toBe("string");

                    const getRes = await client.agents.get(name, { project: sharedProjectName });
                    expect(getRes.agent.name).toBe(name);
                    expect(getRes.agent.id).toBe(createRes.id);

                    const listRes = await client.agents.list({ project: sharedProjectName });
                    expect(Array.isArray(listRes.agents)).toBe(true);
                    expect(listRes.agents.some((a) => a.name === name)).toBe(true);

                    await client.agents.update(name, {
                        project: sharedProjectName,
                        system_prompt: "Updated system prompt.",
                    });

                    const afterUpdate = await client.agents.get(name, { project: sharedProjectName });
                    expect(afterUpdate.agent.system_prompt).toBe("Updated system prompt.");
                } finally {
                    if (created) {
                        await client.agents.delete(name, { project: sharedProjectName });
                    }
                }
            },
            TIMEOUT_MS,
        );
    });

    describe("tools", () => {
        it(
            "creates, reads, lists, updates and deletes a tool",
            async () => {
                const name = uniqueToolName("tool");
                let created = false;

                try {
                    const createRes = await client.tools.create({
                        project: sharedProjectName,
                        name,
                        description: "A test tool created by the SDK CI suite.",
                        type: "custom_context",
                        execution_mode: "sync",
                        context: "This is static context returned to the agent.",
                    });
                    created = true;
                    expect(createRes.name).toBe(name);
                    expect(typeof createRes.id).toBe("string");

                    const getRes = await client.tools.get(name, { project: sharedProjectName });
                    expect(getRes.tool.name).toBe(name);
                    expect(getRes.tool.id).toBe(createRes.id);

                    const listRes = await client.tools.list({ project: sharedProjectName });
                    expect(Array.isArray(listRes.tools)).toBe(true);
                    expect(listRes.tools.some((t) => t.name === name)).toBe(true);

                    await client.tools.update(name, {
                        project: sharedProjectName,
                        description: "Updated tool description.",
                    });

                    const afterUpdate = await client.tools.get(name, { project: sharedProjectName });
                    expect(afterUpdate.tool.description).toBe("Updated tool description.");
                } finally {
                    if (created) {
                        await client.tools.delete(name, { project: sharedProjectName });
                    }
                }
            },
            TIMEOUT_MS,
        );
    });

    describe("conversations", () => {
        it(
            "lists conversations for the workspace",
            async () => {
                const res = await client.conversations.list({ limit: 1 });
                // The list endpoint can return either the paginated or single shape.
                expect(res).toBeDefined();
                if ("conversations" in res) {
                    expect(Array.isArray(res.conversations)).toBe(true);
                }
            },
            TIMEOUT_MS,
        );
    });

    describe("voices", () => {
        it(
            "lists available voices",
            async () => {
                const res = await client.voices.list({ model: "merritt" });
                expect(Array.isArray(res.voices)).toBe(true);
            },
            TIMEOUT_MS,
        );
    });

    describe("extraction schemas", () => {
        it(
            "lists extraction schemas",
            async () => {
                const res = await client.extractionSchemas.list({ project: sharedProjectName });
                expect(Array.isArray(res.extraction_schemas)).toBe(true);
            },
            TIMEOUT_MS,
        );
    });
});
