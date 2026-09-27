import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "es2023",
  outfile: "build/index.js",
  sourcemap: true,
});
