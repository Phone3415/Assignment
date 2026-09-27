import { build, context } from "esbuild";
import { rmSync, existsSync } from "node:fs";

import { execSync } from "node:child_process";

const isWatch = process.argv.includes("--watch");

// Ensure Prisma client is generated before building
if (!existsSync("generated/prisma/client.ts") && !existsSync("generated/prisma/client.js")) {
  console.log("Prisma client not found. Generating...");
  execSync("npx prisma generate", { stdio: "inherit" });
}

// Clean existing build directory
if (existsSync("build")) {
  rmSync("build", { recursive: true, force: true });
}

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: "build/index.js",
  sourcemap: true,
  packages: "external",
  banner: {
    js: `import { createRequire } from "node:module";\nconst require = createRequire(import.meta.url);`,
  },
  logLevel: "info",
};

if (isWatch) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  console.log("👀 Watching for changes...");
} else {
  await build(buildOptions);
  console.log("✓ Build complete: build/index.js");
}

