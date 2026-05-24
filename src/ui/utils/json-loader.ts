import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadJsonFile<T>(relativePathFromProjectRoot: string): T {
  const filePath = resolve(process.cwd(), relativePathFromProjectRoot);
  const fileContent = readFileSync(filePath, "utf-8");

  return JSON.parse(fileContent) as T;
}
