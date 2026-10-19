"use client";

// Source: vercel/ai-elements @ 6a9d5b1822ffb10bba4bd97175f01edd7d8651cd
// Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
import { cn } from "./utils";
import { Controls as ControlsPrimitive } from "@xyflow/react";
import type { ComponentProps } from "react";

export type ControlsProps = ComponentProps<typeof ControlsPrimitive>;

export const Controls = ({ className, ...props }: ControlsProps) => (
  <ControlsPrimitive
    className={cn(
      "gap-px overflow-hidden rounded-md border border-border bg-card p-1 text-card-foreground shadow-none!",
      "[&>button]:rounded-md [&>button]:border-none! [&>button]:bg-transparent! [&>button]:text-card-foreground! [&>button]:hover:bg-secondary! [&>button]:focus-visible:outline-ring",
      className
    )}
    {...props}
  />
);
