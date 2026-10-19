"use client";

// Source: assistant-ui/assistant-ui b6444661cf03cae6c5e10baba1e12c9e010b8ea0
// packages/ui/src/components/react/assistant-ui/elements/memory-chips.tsx
// MIT License, Copyright (c) 2026 AgentbaseAI Inc. See SOURCES.md for the full notice.
import type { ComponentProps } from "react";
import { BrainIcon, XIcon } from "lucide-react";
import { cn } from "./utils";

export type MemoryChange = "added" | "updated" | "existing";

export interface MemoryChip {
  id: string;
  text: string;
  change: MemoryChange;
}

export type MemoryChipsProps = Omit<ComponentProps<"div">, "children"> & {
  chips: readonly MemoryChip[];
  onForget?: (id: string) => void;
  memoryLabel?: string;
  rememberedLabel?: (count: number) => string;
  forgetLabel?: (text: string) => string;
};

export function MemoryChips({
  chips,
  onForget,
  className,
  memoryLabel = "memory",
  rememberedLabel = (count) => `remembered ${count}`,
  forgetLabel = (text) => `Forget "${text}"`,
  ...props
}: MemoryChipsProps) {
  const fresh = chips.filter((chip) => chip.change !== "existing").length;

  return (
    <div {...props} data-slot="memory-chips" className={cn("flex w-full max-w-sm flex-col gap-2", className)}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <BrainIcon aria-hidden="true" className="size-3.5" />
        <span className="font-mono text-xs">
          {fresh > 0 ? rememberedLabel(fresh) : memoryLabel}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <span
            key={chip.id}
            data-change={chip.change}
            className={cn(
              "group flex max-w-full items-center gap-1 rounded-full py-1 pe-1 ps-2.5 text-xs motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-300",
              chip.change === "existing"
                ? "bg-muted text-muted-foreground"
                : "bg-accent text-accent-foreground",
            )}
          >
            <span className="min-w-0 [overflow-wrap:anywhere]">{chip.text}</span>
            {onForget && (
              <button
                type="button"
                aria-label={forgetLabel(chip.text)}
                onClick={() => onForget(chip.id)}
                className="relative flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring pointer-coarse:after:absolute pointer-coarse:after:inset-0 pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11"
              >
                <XIcon aria-hidden="true" className="size-3" />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
