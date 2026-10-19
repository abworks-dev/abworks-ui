import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (name) =>
  readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), "utf8");

const thirdBatch = [
  "permission-grant",
  "guardrail-notice",
  "elicitation-form",
  "web-search",
  "image-generation",
];

test("third batch permission/knowledge components are presentation-only", () => {
  for (const name of thirdBatch) {
    const source = read(name);
    assert.doesNotMatch(
      source,
      /@radix|@assistant-ui|cmdk|data-state|asChild|fetch\(|XMLHttpRequest|navigator\.clipboard|child_process|WebSocket|Image\(/,
      `${name} must not own transport, process, or a foreign runtime`,
    );
  }
});

test("third batch uses Aboard Base UI primitives", () => {
  assert.match(read("permission-grant"), /@aboard\/ui\/core\/button/);
  assert.match(read("guardrail-notice"), /@aboard\/ui\/core\/alert/);
  assert.match(read("elicitation-form"), /@aboard\/ui\/core\/input/);
  assert.match(read("elicitation-form"), /@aboard\/ui\/core\/textarea/);
});

test("permission grant and elicitation submit remain caller-owned callbacks", () => {
  assert.match(read("permission-grant"), /onGrant\?: \(\) => void/);
  assert.match(read("permission-grant"), /onDeny\?: \(\) => void/);
  assert.match(
    read("elicitation-form"),
    /onSubmit\?: \(values: ElicitationValues\) => void/,
  );
  assert.doesNotMatch(read("elicitation-form"), /fetch\(|XMLHttpRequest/);
});

test("web search and image generation never fetch or generate", () => {
  assert.doesNotMatch(
    read("web-search"),
    /fetch\(|XMLHttpRequest|window\.open/,
  );
  assert.doesNotMatch(
    read("image-generation"),
    /fetch\(|XMLHttpRequest|new Image\(/,
  );
});

test("third batch exports are registered in the public index", () => {
  const index = readFileSync(
    new URL("../src/index.ts", import.meta.url),
    "utf8",
  );
  for (const name of [
    "PermissionGrant",
    "GuardrailNotice",
    "ElicitationForm",
    "WebSearch",
    "ImageGeneration",
  ]) {
    assert.match(
      index,
      new RegExp(`export \\{[\\s\\S]*?\\b${name}\\b[\\s\\S]*?\\} from`),
      `${name} missing from index`,
    );
  }
});
