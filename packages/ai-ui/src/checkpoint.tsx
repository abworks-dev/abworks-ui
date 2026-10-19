// AI Elements - Apache-2.0
// Copyright (c) 2025 Vercel
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/checkpoint.tsx
// ABWorks adaptations: Base Nova Button/Separator/Tooltip with Base UI render composition.
"use client";

import {
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@abworks-dev/ui";
import type { ButtonProps } from "@abworks-dev/ui";
import { BookmarkIcon } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";

export type CheckpointProps = ComponentProps<"div">;

export const Checkpoint = ({
  className,
  children,
  ...props
}: CheckpointProps) => (
  <div
    className={cn(
      "flex items-center gap-0.5 overflow-hidden text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
    <Separator />
  </div>
);

export type CheckpointIconProps = LucideProps;

export const CheckpointIcon = ({
  className,
  children,
  ...props
}: CheckpointIconProps) =>
  children ?? (
    <BookmarkIcon className={cn("size-4 shrink-0", className)} {...props} />
  );

export type CheckpointTriggerProps = ButtonProps & {
  tooltip?: string;
};

export const CheckpointTrigger = ({
  children,
  variant = "ghost",
  size = "sm",
  tooltip,
  ...props
}: CheckpointTriggerProps) => {
  const button = (
    <Button size={size} type="button" variant={variant} {...props}>
      {children}
    </Button>
  );

  return tooltip ? (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent align="start" side="bottom">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  ) : (
    button
  );
};
