"use client";

// Source: vercel/ai-elements @ 6a9d5b1822ffb10bba4bd97175f01edd7d8651cd
// Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
import { cn } from "./utils";
import { NodeToolbar, Position } from "@xyflow/react";
import type { ComponentProps } from "react";

export type ToolbarProps = ComponentProps<typeof NodeToolbar>;

export const Toolbar = ({ className, ...props }: ToolbarProps) => (
  <NodeToolbar
    className={cn(
      "flex items-center gap-1 rounded-sm border border-border bg-background p-1.5 text-foreground",
      className
    )}
    position={Position.Bottom}
    {...props}
  />
);
