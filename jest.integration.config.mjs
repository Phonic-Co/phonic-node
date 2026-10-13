// Maintained manually (listed in .fernignore). Fern does not overwrite this file.
//
// Separate Jest config for the live integration suite. Kept out of the default
// `jest.config.mjs` (which Fern regenerates) so these credential-dependent,
// network-hitting tests never run as part of `yarn test` / unit / wire runs.

/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    displayName: "integration",
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    roots: ["<rootDir>/tests-integration"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    workerThreads: false,
    // Integration tests share a live workspace; run serially to avoid cross-test
    // interference and to keep request volume predictable.
    maxWorkers: 1,
    testTimeout: 60_000,
    passWithNoTests: true,
};
