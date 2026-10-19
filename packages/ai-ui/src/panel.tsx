"use client";

// Source: vercel/ai-elements @ 6a9d5b1822ffb10bba4bd97175f01edd7d8651cd
// Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
import { cn } from "./utils";
import { Panel as PanelPrimitive } from "@xyflow/react";
import type { ComponentProps } from "react";

export type PanelProps = ComponentProps<typeof PanelPrimitive>;

export const Panel = ({ className, ...props }: PanelProps) => (
  <PanelPrimitive
    className={cn(
      "m-4 overflow-hidden rounded-md border border-border bg-card p-1 text-card-foreground",
      className
    )}
    {...props}
  />
);
