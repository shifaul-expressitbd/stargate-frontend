import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/v2/api": {
        target: "https://backend.calquick.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/v2/api"),
      },
      "/api/pdf": {
        target: "http://31.97.62.51:4000",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api\/pdf/, '/pdf'),
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
    chunkSizeWarningLimit: 1000, // in kB
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
