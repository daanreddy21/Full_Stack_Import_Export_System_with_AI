import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
export default defineConfig({
  plugins: [
    react(),
    compression()
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("react")
          ) {
            return "react-vendor";
          }
          if (
            id.includes(
              "react-router-dom"
            )
          ) {
            return "router";
          }
        }
      }
    }
  }
});