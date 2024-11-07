/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            // with options
            "/setProjectPath": {
                target: "http://localhost:4000/setProjectPath",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/setProjectPath/, ""),
            },
            "/getLogs": {
                target: "http://localhost:4000/getLogs",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/getLogs/, ""),
            },
            "/getLogInfo": {
                target: "http://localhost:4000/getLogInfo",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/getLogInfo/, ""),
            },
        },
    },
    plugins: [
        react(),
        svgrPlugin({
            svgrOptions: {
                icon: true,
            },
        }),
    ],
    build: {
        // outDir: "../build/frontend", // THIS SHOULD BE USED IN PRODUCTION
        outDir: "./build",
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        css: true,
        setupFiles: "./src/test/setup.ts",
    },
});
