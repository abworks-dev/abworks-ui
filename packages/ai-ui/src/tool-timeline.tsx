// Aboard pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Tool timeline  https://www.assistant-ui.com/elements/tool-timeline
// Caller-owned presentation only: timeline entries are DTOs.
"use client";

import { cn } from "./utils";
import type { HTMLAttributes, ReactNode } from "react";

export type ToolTimelineEntry = {
  id: string;
  verb: string;
  target: string;
  status?: "pending" | "running" | "complete" | "failed";
  meta?: string;
  icon?: ReactNode;
};

const statusDot = {
  pending: "bg-muted-foreground/40",
  running: "bg-primary animate-pulse",
  complete: "bg-emerald-500",
  failed: "bg-red-500",
} as const;

/**
 * ToolTimeline summarizes a working session as verbs, targets, and file stats.
 * Entries are caller-owned DTOs; no execution state lives in this component.
 */
export type ToolTimelineProps = HTMLAttributes<HTMLDivElement> & {
  entries: ToolTimelineEntry[];
};

export const ToolTimeline = ({
  entries,
  className,
  ...props
}: ToolTimelineProps) => (
  <div
    data-slot="tool-timeline"
    className={cn("flex w-full flex-col gap-1", className)}
    {...props}
  >
    {entries.map((entry, index) => {
      const isLast = index === entries.length - 1;
      return (
        <div key={entry.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              data-status={entry.status ?? "pending"}
              className={cn(
                "mt-1.5 size-2.5 rounded-full",
                statusDot[entry.status ?? "pending"],
              )}
            />
            {!isLast && (
              <span className="w-px flex-1 bg-border" aria-hidden="true" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 items-baseline gap-2 py-1 text-sm">
            {entry.icon}
            <span className="font-medium">{entry.verb}</span>
            <span className="truncate text-muted-foreground">
              {entry.target}
            </span>
            {entry.meta && (
              <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground/70">
                {entry.meta}
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
);
