import { defineConfig } from "vitest/config";

// Standalone test config (NOT vite.config.ts, which throws when the dev server's
// .ports.json is absent). The learning engine is pure TS, so the node
// environment is enough — fast, deterministic, no DOM.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: false,
  },
});
