import { resolve } from "path";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "smartr",
      // the proper extensions will be added
      fileName: (format) => {
        return `index.${format.toString() === "es" ? "js" : "umd.js"}`;
      },
    },
  },
  test: {
    environment: "jsdom",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    react(),
  ],
}));
