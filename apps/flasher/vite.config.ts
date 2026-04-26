/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  base: "/flasher/",
  build: {
    outDir: "dist",
  },
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
