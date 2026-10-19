// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Stopped run  https://www.assistant-ui.com/elements/stopped-run
// Caller-owned presentation only: the partial answer is children; continuing is a callback.
"use client";

import { Button } from "@abworks-dev/ui/core/button";
import { RotateCwIcon, SquareIcon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes, ReactNode } from "react";

export type StoppedRunProps = HTMLAttributes<HTMLDivElement> & {
  onContinue?: () => void;
  continueLabel?: string;
  stoppedLabel?: string;
  children?: ReactNode;
};

/**
 * StoppedRun keeps a half-written answer visible after a stop and offers a
 * one-tap continue. It does not own the run; `onContinue` is caller-owned.
 */
export const StoppedRun = ({
  onContinue,
  continueLabel = "Continue",
  stoppedLabel = "Stopped",
  className,
  children,
  ...props
}: StoppedRunProps) => (
  <div
    data-slot="stopped-run"
    className={cn("flex w-full flex-col gap-3", className)}
    {...props}
  >
    {children && (
      <div className="text-sm text-muted-foreground [&>*:last-child]:mb-0">
        {children}
      </div>
    )}
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1">
        <SquareIcon aria-hidden="true" className="size-3" />
        {stoppedLabel}
      </span>
      {onContinue && (
        <Button type="button" variant="outline" size="sm" onClick={onContinue}>
          <RotateCwIcon aria-hidden="true" className="size-3.5" />
          {continueLabel}
        </Button>
      )}
    </div>
  </div>
);
