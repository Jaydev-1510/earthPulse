import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["three", "r3f-globe"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("@react-three/fiber") ||
              id.includes("@react-three/drei")
            ) {
              return "r3f";
            }
            if (id.includes("r3f-globe")) {
              return "globe";
            }
            if (id.includes("/three/")) {
              return "three";
            }
            if (id.includes("/d3/") || id.includes("/d3-")) {
              return "d3";
            }
          }
        },
      },
    },
  },
});
