import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (name) =>
  readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), "utf8");

const firstBatch = [
  "streaming-text",
  "message-error",
  "message-queue",
  "edit-message",
  "feedback-dialog",
  "stopped-run",
];

test("first batch conversation-state components are presentation-only", () => {
  for (const name of firstBatch) {
    const source = read(name);
    assert.doesNotMatch(
      source,
      /@radix|@assistant-ui|cmdk|data-state|asChild|fetch\(|XMLHttpRequest|navigator\.clipboard/,
      `${name} must not pull in a foreign runtime or own transport/clipboard`,
    );
  }
});

test("first batch uses ABWorks Base UI primitives, not local reinventions", () => {
  assert.match(read("message-error"), /@abworks-dev\/ui\/core\/alert/);
  assert.match(read("message-error"), /@abworks-dev\/ui\/core\/button/);
  assert.match(read("message-queue"), /@abworks-dev\/ui\/core\/button/);
  assert.match(read("edit-message"), /@abworks-dev\/ui\/core\/textarea/);
  assert.match(read("feedback-dialog"), /@abworks-dev\/ui\/core\/dialog/);
  assert.match(read("streaming-text"), /@abworks-dev\/ui\/core\/spinner/);
});

test("caller-owned callbacks are preserved for side-effectful actions", () => {
  assert.match(read("message-error"), /onRetry\?: \(\) => void/);
  assert.match(read("message-queue"), /onCancel\?: \(id: string\) => void/);
  assert.match(read("edit-message"), /onSave\?: \(value: string\) => void/);
  assert.match(
    read("feedback-dialog"),
    /onSubmit\?: \(reason: string\) => void/,
  );
  assert.match(read("stopped-run"), /onContinue\?: \(\) => void/);
});

test("first batch exports are registered in the public index", () => {
  const index = readFileSync(
    new URL("../src/index.ts", import.meta.url),
    "utf8",
  );
  for (const name of [
    "StreamingText",
    "ThinkingIndicator",
    "TypingIndicator",
    "MessageError",
    "MessageQueue",
    "EditMessage",
    "FeedbackDialog",
    "StoppedRun",
  ]) {
    assert.match(
      index,
      new RegExp(`export \\{[\\s\\S]*?\\b${name}\\b[\\s\\S]*?\\} from`),
      `${name} missing from index`,
    );
  }
});
