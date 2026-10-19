// ABWorks pattern reference - not a source copy.
// Visual/interaction semantics reference assistant-ui Elements:
//   - Streaming text  https://www.assistant-ui.com/elements/streaming-text
//   - Thinking indicator  https://www.assistant-ui.com/elements/thinking-indicator
//   - Typing indicator  https://www.assistant-ui.com/elements/typing-indicator
// Caller-owned presentation only: all state (streaming, elapsed, activity) arrives via props.
"use client";

import { Spinner } from "@abworks-dev/ui/core/spinner";
import { cn } from "./utils";
import type { HTMLAttributes } from "react";

/**
 * StreamingText renders the newest tokens with a soft "settling ink" emphasis
 * while a run is still producing. Callers own the text and the streaming flag;
 * this component only applies a transient highlight to the trailing content.
 */
export type StreamingTextProps = HTMLAttributes<HTMLSpanElement> & {
  isStreaming?: boolean;
};

export const StreamingText = ({
  isStreaming,
  className,
  children,
  ...props
}: StreamingTextProps) => (
  <span
    data-slot="streaming-text"
    data-streaming={isStreaming ? "" : undefined}
    className={cn(
      "transition-colors duration-700",
      isStreaming &&
        "text-primary decoration-primary/40 [transition:color_0.7s_ease]",
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

/**
 * ThinkingIndicator is a live status line that names what the agent is doing
 * right now, with elapsed time. `label` and `elapsedMs` are caller-owned.
 */
export type ThinkingIndicatorProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  elapsedMs?: number;
};

const formatElapsed = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
};

export const ThinkingIndicator = ({
  label,
  elapsedMs,
  className,
  ...props
}: ThinkingIndicatorProps) => (
  <div
    data-slot="thinking-indicator"
    className={cn(
      "flex items-center gap-2 text-sm text-muted-foreground",
      className,
    )}
    {...props}
  >
    <Spinner className="size-3.5" aria-hidden="true" />
    <span className="truncate">{label}</span>
    {elapsedMs !== undefined && (
      <span
        aria-hidden="true"
        className="tabular-nums text-muted-foreground/70"
      >
        {formatElapsed(elapsedMs)}
      </span>
    )}
  </div>
);

/**
 * TypingIndicator renders the classic three-dot presence marker. It is a
 * static motion cue with no running state of its own; show/hide is caller-owned.
 */
export type TypingIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string;
};

export const TypingIndicator = ({
  label = "Typing",
  className,
  ...props
}: TypingIndicatorProps) => (
  <span
    data-slot="typing-indicator"
    role="status"
    aria-label={label}
    className={cn("inline-flex items-center gap-1 py-1", className)}
    {...props}
  >
    {[0, 1, 2].map((index) => (
      <span
        key={index}
        aria-hidden="true"
        className="size-1.5 rounded-full bg-muted-foreground/70 motion-safe:animate-bounce"
        style={{ animationDelay: `${index * 120}ms` }}
      />
    ))}
  </span>
);
