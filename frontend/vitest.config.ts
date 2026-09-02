import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      environmentOptions: {
        jsdom: {
          url: "http://localhost:3000",
        },
      },
      setupFiles: "./src/test/setup.ts",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "dist/",
          "src/test/",
          "**/*.d.ts",
          "vite.config.ts",
          "vitest.config.ts",
        ],
      },
    },
  }),
);
