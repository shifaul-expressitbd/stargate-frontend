/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
// https://vite.dev/config/
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { fileURLToPath } from "node:url";
const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://localhost:5555",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  plugins: [
    react(),
    createHtmlPlugin({
      inject: {
        data: {
          version: process.env.npm_package_version,
          buildDate: new Date().toISOString(),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {},
    chunkSizeWarningLimit: 1000,
    // in kB
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
