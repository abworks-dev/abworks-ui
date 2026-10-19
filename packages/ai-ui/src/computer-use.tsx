// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Computer use  https://www.assistant-ui.com/elements/computer-use
// Caller-owned presentation only: the screen capture, cursor trail, and current action are DTOs.
"use client";

import { MousePointer2Icon } from "lucide-react";
import { cn } from "./utils";
import type { HTMLAttributes } from "react";

export type ComputerUseCursorPoint = {
  x: number;
  y: number;
  /** Normalized 0..1 coordinates relative to the screenshot. */
};

/**
 * ComputerUse renders the screen an agent is driving, with a cursor trail and
 * the current action. It never drives anything; all state is caller-owned.
 */
export type ComputerUseProps = HTMLAttributes<HTMLDivElement> & {
  screenshotUrl?: string;
  screenshotAlt?: string;
  cursor?: ComputerUseCursorPoint;
  trail?: ComputerUseCursorPoint[];
  action?: string;
};

export const ComputerUse = ({
  screenshotUrl,
  screenshotAlt = "Agent-driven screen",
  cursor,
  trail = [],
  action,
  className,
  ...props
}: ComputerUseProps) => (
  <div
    data-slot="computer-use"
    className={cn(
      "relative overflow-hidden rounded-lg border bg-muted/20",
      className,
    )}
    {...props}
  >
    {screenshotUrl ? (
      // The screenshot is caller-supplied content, not an arbitrary remote fetch.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={screenshotUrl}
        alt={screenshotAlt}
        className="block h-auto w-full"
        draggable={false}
      />
    ) : (
      <div className="grid aspect-video w-full place-items-center text-sm text-muted-foreground">
        {screenshotAlt}
      </div>
    )}
    {trail.length > 0 && (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          points={trail
            .map((point) => `${point.x * 100},${point.y * 100}`)
            .join(" ")}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.5}
          strokeWidth={0.6}
          className="text-primary"
        />
      </svg>
    )}
    {cursor && (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute text-primary"
        style={{ left: `${cursor.x * 100}%`, top: `${cursor.y * 100}%` }}
      >
        <MousePointer2Icon className="size-4 -translate-x-0.5 -translate-y-0.5" />
      </span>
    )}
    {action && (
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-background/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
        <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
        {action}
      </div>
    )}
  </div>
);
