import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "next/image": path.resolve(__dirname, "./__mocks__/next-image.tsx"),
      "next/link": path.resolve(__dirname, "./__mocks__/next-link.tsx"),
      "next/navigation": path.resolve(__dirname, "./__mocks__/next-navigation.ts"),
    },
  },
});
