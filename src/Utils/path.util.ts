import path from "node:path";

export const ROOT = process.cwd();

export const frontEnd = (...filePath: string[]) => {
  return path.resolve(ROOT, "front-end", ...filePath);
};
export const staticDir = path.resolve(ROOT, "static");
