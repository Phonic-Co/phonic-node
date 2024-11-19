import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  dts: true, // Generate declaration file (*.d.ts)
  clean: true, // Clean output directory before each build
});
