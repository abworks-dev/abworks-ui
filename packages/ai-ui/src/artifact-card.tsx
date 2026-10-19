"use client";

// Source: assistant-ui/assistant-ui b6444661cf03cae6c5e10baba1e12c9e010b8ea0
// packages/ui/src/components/react/assistant-ui/elements/artifact-card.tsx
// MIT License, Copyright (c) 2026 AgentbaseAI Inc. See SOURCES.md for the full notice.
import type { ComponentProps } from "react";
import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import { cn } from "./utils";

export type ArtifactCardProps = Omit<ComponentProps<"div">, "children" | "title"> & {
  title: string;
  meta: string;
  generating?: boolean;
  words?: number;
  writingLabel?: string;
  wordsLabel?: (count: number) => string;
};

export function ArtifactCard({
  title,
  meta,
  generating = false,
  words = 0,
  writingLabel = "Writing",
  wordsLabel = (count) => `${count} words`,
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: ArtifactCardProps) {
  const clickable = Boolean(onClick);

  return (
    <div
      {...props}
      data-slot="artifact-card"
      role={clickable ? "button" : role}
      tabIndex={clickable ? (tabIndex ?? 0) : tabIndex}
      aria-disabled={props["aria-disabled"]}
      onClick={(event) => {
        if (props["aria-disabled"] === true || props["aria-disabled"] === "true") {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!clickable || event.defaultPrevented || event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!event.repeat) event.currentTarget.click();
        }
      }}
      className={cn(
        "group flex w-full max-w-xs items-center gap-3 rounded-lg border border-border bg-background p-3.5 outline-none dark:bg-popover",
        "focus-visible:ring-2 focus-visible:ring-ring",
        clickable && "cursor-pointer motion-safe:transition-transform motion-safe:duration-150 motion-safe:hover:-translate-y-px motion-safe:active:scale-[0.98]",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <FileTextIcon aria-hidden="true" className={cn("size-4", generating && "motion-safe:animate-pulse")} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" title={title}>{title}</p>
        {generating ? (
          <p className="flex flex-wrap items-center gap-1 font-mono text-xs text-muted-foreground">
            <span className="aui-artifact-shimmer">{writingLabel}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="tabular-nums">{wordsLabel(words)}</span>
          </p>
        ) : (
          <p className="[overflow-wrap:anywhere] font-mono text-xs text-muted-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">{meta}</p>
        )}
      </div>
      <ArrowUpRightIcon aria-hidden="true" className={cn("size-3.5 shrink-0 text-muted-foreground", clickable ? "opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" : "hidden")} />
    </div>
  );
}
