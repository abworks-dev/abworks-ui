import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (name) =>
  readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), "utf8");

const secondBatch = [
  "code-diff",
  "tool-timeline",
  "code-runner",
  "computer-use",
];

test("second batch tool/workbench components are presentation-only", () => {
  for (const name of secondBatch) {
    const source = read(name);
    assert.doesNotMatch(
      source,
      /@radix|@assistant-ui|cmdk|data-state|asChild|fetch\(|XMLHttpRequest|navigator\.clipboard|child_process|WebSocket/,
      `${name} must not own transport, clipboard, process, or a foreign runtime`,
    );
  }
});

test("second batch uses Aboard Base UI primitives", () => {
  assert.match(read("code-diff"), /@aboard\/ui\/core\/button/);
  assert.match(read("code-runner"), /@aboard\/ui\/core\/button/);
});

test("second batch keeps execution and review decisions caller-owned", () => {
  assert.match(
    read("code-diff"),
    /onDecision\?: \(hunkId: string, decision: ReviewableDiffDecision\) => void/,
  );
  assert.match(read("code-runner"), /onRun\?: \(\) => void/);
  assert.doesNotMatch(read("code-runner"), /eval\(|new Function/);
});

test("terminal exit status is caller-owned and does not add runtime authority", () => {
  const source = read("terminal");
  assert.match(source, /exitStatus\?: number/);
  assert.match(source, /data-slot="terminal-exit-status"/);
  assert.doesNotMatch(source, /fetch\(|child_process|exec\(/);
});

test("second batch exports are registered in the public index", () => {
  const index = readFileSync(
    new URL("../src/index.ts", import.meta.url),
    "utf8",
  );
  for (const name of [
    "CodeDiff",
    "ReviewableDiff",
    "ToolTimeline",
    "CodeRunner",
    "ComputerUse",
  ]) {
    assert.match(
      index,
      new RegExp(`export \\{[\\s\\S]*?\\b${name}\\b[\\s\\S]*?\\} from`),
      `${name} missing from index`,
    );
  }
});
