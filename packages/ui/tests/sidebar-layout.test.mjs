import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(
  new URL("../src/styles/reui/style-nova.css", import.meta.url),
  "utf8",
);
const insetRule = source.match(/\.cn-sidebar-inset\s*\{([^}]*)\}/s)?.[1];

test("collapsed inset keeps the same start edge as the sidebar track", () => {
  assert.ok(insetRule, "sidebar inset style rule exists");
  assert.match(insetRule, /peer-data-\[variant=inset\]:m-2/);
  assert.doesNotMatch(insetRule, /peer-data-\[state=collapsed\].*ml-2/);
});
