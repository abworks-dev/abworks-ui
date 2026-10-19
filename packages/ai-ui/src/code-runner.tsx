// Aboard pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Code runner  https://www.assistant-ui.com/elements/code-runner
// Caller-owned presentation only: the snippet, run intent, and output are props/callbacks.
"use client";

import { Button } from "@aboard/ui/core/button";
import { PlayIcon, RotateCwIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes, ReactNode } from "react";

export type CodeRunnerStatus = "idle" | "running" | "complete" | "failed";

/**
 * CodeRunner presents a snippet with a run button and the output produced below it.
 * It never executes code; `onRun` is caller-owned.
 */
export type CodeRunnerProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language?: string;
  status?: CodeRunnerStatus;
  output?: ReactNode;
  onRun?: () => void;
  runLabel?: string;
};

export const CodeRunner = ({
  code,
  language,
  status = "idle",
  output,
  onRun,
  runLabel = "Run",
  className,
  ...props
}: CodeRunnerProps) => {
  const running = status === "running";

  return (
    <div
      data-slot="code-runner"
      className={cn("overflow-hidden rounded-lg border", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2">
        <span className="truncate font-mono text-xs text-muted-foreground">
          {language ?? "code"}
        </span>
        {onRun && (
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onRun}
            disabled={running}
          >
            {running ? (
              <RotateCwIcon
                aria-hidden="true"
                className="size-3.5 animate-spin"
              />
            ) : (
              <PlayIcon aria-hidden="true" className="size-3.5" />
            )}
            {runLabel}
          </Button>
        )}
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
      {output !== undefined && (
        <div
          data-status={status}
          className="border-t bg-muted/20 px-3 py-2 font-mono text-sm text-muted-foreground"
        >
          {output}
        </div>
      )}
    </div>
  );
};
