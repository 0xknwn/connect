import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      "/message": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
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
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
}));
