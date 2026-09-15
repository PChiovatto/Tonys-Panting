// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

it("ships all local media referenced by the source and asset manifests", () => {
  const missing: string[] = [];
  for (const file of filesIn("src").filter((file) => /\.(tsx?|json|css)$/.test(file))) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(/["'`](\/(?:images|videos|__l5e)\/[^"'`]+?\.(?:jpg|jpeg|png|webp|mp4))/g)) {
      if (!existsSync(join("public", match[1]))) missing.push(`${file}: ${match[1]}`);
    }
  }
  expect(missing).toEqual([]);
});
