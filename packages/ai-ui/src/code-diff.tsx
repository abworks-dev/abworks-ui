// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Code diff  https://www.assistant-ui.com/elements/code-diff
//   - Reviewable diff  https://www.assistant-ui.com/elements/reviewable-diff
// Caller-owned presentation only: diff hunks are DTOs; review decisions are callbacks.
"use client";

import { Button } from "@abworks-dev/ui/core/button";
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes } from "react";

export type DiffLine = {
  type: "add" | "remove" | "context";
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
};

export type DiffHunk = {
  id: string;
  lines: DiffLine[];
};

const lineTone = {
  add: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  remove: "bg-red-500/10 text-red-700 dark:text-red-300",
  context: "text-foreground",
} as const;

const lineMarker = {
  add: <PlusIcon aria-hidden="true" className="size-3.5" />,
  remove: <MinusIcon aria-hidden="true" className="size-3.5" />,
  context: null,
} as const;

/**
 * CodeDiff renders a unified diff with tinted additions and removals, sized for chat.
 * Hunks are caller-owned DTOs; no diff computation or source access happens here.
 */
export type CodeDiffProps = HTMLAttributes<HTMLDivElement> & {
  hunks: DiffHunk[];
  filename?: string;
};

export const CodeDiff = ({
  hunks,
  filename,
  className,
  ...props
}: CodeDiffProps) => (
  <div
    data-slot="code-diff"
    className={cn(
      "overflow-hidden rounded-lg border font-mono text-sm",
      className,
    )}
    {...props}
  >
    {filename && (
      <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        {filename}
      </div>
    )}
    <div className="overflow-x-auto">
      {hunks.map((hunk) => (
        <div
          key={hunk.id}
          data-slot="diff-hunk"
          className="border-b last:border-b-0"
        >
          {hunk.lines.map((line, index) => (
            <div
              key={`${hunk.id}-${index}`}
              data-line-type={line.type}
              className={cn(
                "grid grid-cols-[auto_auto_1fr] gap-2 whitespace-pre px-3 py-0.5",
                lineTone[line.type],
              )}
            >
              <span
                aria-hidden="true"
                className="grid size-3.5 place-items-center opacity-60"
              >
                {lineMarker[line.type]}
              </span>
              <span
                aria-hidden="true"
                className="select-none text-right opacity-40 tabular-nums"
              >
                {line.oldLineNumber ?? ""}
              </span>
              <span className="min-w-0">{line.content || " "}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export type ReviewableDiffDecision = "keep" | "discard";

export type ReviewableHunk = DiffHunk & {
  decision?: ReviewableDiffDecision;
};

/**
 * ReviewableDiff renders the same diff but each hunk is a decision: keep or discard.
 * Decisions and their callbacks are caller-owned; nothing is applied here.
 */
export type ReviewableDiffProps = Omit<CodeDiffProps, "hunks"> & {
  hunks: ReviewableHunk[];
  onDecision?: (hunkId: string, decision: ReviewableDiffDecision) => void;
  applyLabel?: string;
  discardLabel?: string;
  onApply?: () => void;
  applyText?: string;
};

export const ReviewableDiff = ({
  hunks,
  onDecision,
  applyLabel = "Keep",
  discardLabel = "Discard",
  onApply,
  applyText = "Apply",
  className,
  ...props
}: ReviewableDiffProps) => (
  <div
    data-slot="reviewable-diff"
    className={cn("flex flex-col gap-2", className)}
    {...props}
  >
    {hunks.map((hunk) => (
      <div key={hunk.id} className="rounded-lg border">
        <div className="flex items-center gap-1 border-b bg-muted/30 px-2 py-1.5">
          <Button
            type="button"
            variant={hunk.decision === "keep" ? "secondary" : "ghost"}
            size="xs"
            onClick={() => onDecision?.(hunk.id, "keep")}
          >
            <CheckIcon aria-hidden="true" className="size-3.5" />
            {applyLabel}
          </Button>
          <Button
            type="button"
            variant={hunk.decision === "discard" ? "secondary" : "ghost"}
            size="xs"
            onClick={() => onDecision?.(hunk.id, "discard")}
          >
            <XIcon aria-hidden="true" className="size-3.5" />
            {discardLabel}
          </Button>
        </div>
        <CodeDiff hunks={[hunk]} />
      </div>
    ))}
    {onApply && (
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={onApply}>
          {applyText}
        </Button>
      </div>
    )}
  </div>
);
