import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { NgmiPolyfill } from "vite-plugin-ngmi-polyfill";
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

const inject = require('@rollup/plugin-inject')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
    [NgmiPolyfill()],
  ],
  resolve: {
    alias: {
      lib: resolve(__dirname, "src/lib"),
      routes: resolve(__dirname, "src/routes"),
    }
  },
  optimizeDeps: {
    esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
            global: 'globalThis'
        },
        plugins: [
       
        ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        inject({ Buffer: ['Buffer', 'Buffer'] }),
        rollupNodePolyFill()
      ],
      external: ['@liftedinit/many-js']
    },
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "unsafe-none",
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    },
    cors: { origin: "*" },
    proxy: {
      '/api': {
        target: 'http://localhost:8000/',
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
