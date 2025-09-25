// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 36663, // ✅ use 6666 instead of invalid 0666 for demo
  },
});
