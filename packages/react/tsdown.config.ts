import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  hash: false,
  external: ["react", "refport-js"],
  outputOptions: {
    banner: '"use client";',
  },
});
