// AI Elements - Apache-2.0
// Copyright (c) 2025 Vercel
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/context.tsx
// ABWorks adaptations: Base Nova HoverCard/Progress and caller-provided cost DTOs replace upstream pricing calculation.
"use client";

import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Progress,
} from "@abworks-dev/ui";
import type { LanguageModelUsage } from "ai";
import type { ComponentProps } from "react";
import { createContext, isValidElement, useContext, useMemo } from "react";
import { cn } from "./utils";

const PERCENT_MAX = 100;
const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 2;
const normalizeUtilization = (usedTokens: number, maxTokens: number) => {
  const ratio = maxTokens > 0 ? usedTokens / maxTokens : 0;
  return Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0;
};

type ModelId = string;

export interface ContextUsageCosts {
  cache?: number;
  input?: number;
  output?: number;
  reasoning?: number;
  total?: number;
}

interface ContextSchema {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: ModelId;
  costs?: ContextUsageCosts;
}

const ContextContext = createContext<ContextSchema | null>(null);

const useContextValue = () => {
  const context = useContext(ContextContext);

  if (!context) {
    throw new Error("Context components must be used within Context");
  }

  return context;
};

export type ContextProps = ComponentProps<typeof HoverCard> & ContextSchema;

export const Context = ({
  usedTokens,
  maxTokens,
  usage,
  modelId,
  costs,
  ...props
}: ContextProps) => {
  const contextValue = useMemo(
    () => ({ costs, maxTokens, modelId, usage, usedTokens }),
    [costs, maxTokens, modelId, usage, usedTokens]
  );

  return (
    <ContextContext.Provider value={contextValue}>
      <HoverCard closeDelay={0} openDelay={0} {...props} />
    </ContextContext.Provider>
  );
};

const ContextIcon = () => {
  const { usedTokens, maxTokens } = useContextValue();
  const circumference = 2 * Math.PI * ICON_RADIUS;
  const usedPercent = normalizeUtilization(usedTokens, maxTokens);
  const dashOffset = circumference * (1 - Math.min(usedPercent, 1));

  return (
    <svg
      aria-label="Model context usage"
      height="20"
      role="img"
      style={{ color: "currentcolor" }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="20"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={ICON_RADIUS}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
      />
    </svg>
  );
};

export type ContextTriggerProps = ComponentProps<typeof Button>;

export const ContextTrigger = ({ children, ...props }: ContextTriggerProps) => {
  const { usedTokens, maxTokens } = useContextValue();
  const usedPercent = normalizeUtilization(usedTokens, maxTokens);
  const renderedPercent = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(usedPercent);
  if (isValidElement(children)) {
    return <HoverCardTrigger render={children} />;
  }

  return (
    <HoverCardTrigger
      render={
        <Button type="button" variant="ghost" {...props}>
          {children ?? (
            <>
              <span className="font-medium text-muted-foreground">{renderedPercent}</span>
              <ContextIcon />
            </>
          )}
        </Button>
      }
    />
  );
};

export type ContextContentProps = ComponentProps<typeof HoverCardContent>;

export const ContextContent = ({
  className,
  ...props
}: ContextContentProps) => (
  <HoverCardContent
    className={cn("min-w-60 divide-y overflow-hidden p-0", className)}
    {...props}
  />
);

export type ContextContentHeaderProps = ComponentProps<"div">;

export const ContextContentHeader = ({
  children,
  className,
  ...props
}: ContextContentHeaderProps) => {
  const { usedTokens, maxTokens } = useContextValue();
  const usedPercent = normalizeUtilization(usedTokens, maxTokens);
  const displayPct = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(usedPercent);
  const used = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(usedTokens);
  const total = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(maxTokens);

  return (
    <div className={cn("w-full space-y-2 p-3", className)} {...props}>
      {children ?? (
        <>
          <div className="flex items-center justify-between gap-3 text-xs">
            <p>{displayPct}</p>
            <p className="font-mono text-muted-foreground">
              {used} / {total}
            </p>
          </div>
          <div className="space-y-2">
            <Progress className="bg-muted" value={Math.min(usedPercent, 1) * PERCENT_MAX} />
          </div>
        </>
      )}
    </div>
  );
};

export type ContextContentBodyProps = ComponentProps<"div">;

export const ContextContentBody = ({
  children,
  className,
  ...props
}: ContextContentBodyProps) => (
  <div className={cn("w-full p-3", className)} {...props}>
    {children}
  </div>
);

const formatCost = (cost: number | undefined) =>
  cost === undefined || !Number.isFinite(cost) ? "unknown" : new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(cost);

export type ContextContentFooterProps = ComponentProps<"div">;

export const ContextContentFooter = ({
  children,
  className,
  ...props
}: ContextContentFooterProps) => {
  const { costs } = useContextValue();

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-3 bg-secondary p-3 text-xs",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <span className="text-muted-foreground">Total cost</span>
          <span>{formatCost(costs?.total)}</span>
        </>
      )}
    </div>
  );
};

const TokensWithCost = ({
  tokens,
  costText,
}: {
  tokens?: number;
  costText?: string;
}) => (
  <span>
    {tokens === undefined
      ? "-"
      : new Intl.NumberFormat("en-US", {
          notation: "compact",
        }).format(tokens)}
    {costText ? <span className="ml-2 text-muted-foreground">{costText}</span> : null}
  </span>
);

const UsageRow = ({
  children,
  className,
  label,
  tokens,
  cost,
  ...props
}: ComponentProps<"div"> & {
  label: string;
  tokens: number;
  cost?: number;
}) => {
  if (children || !tokens) {
    return children ?? null;
  }

  return (
    <div
      className={cn("flex items-center justify-between text-xs", className)}
      {...props}
    >
      <span className="text-muted-foreground">{label}</span>
      <TokensWithCost costText={cost === undefined ? undefined : formatCost(cost)} tokens={tokens} />
    </div>
  );
};

export type ContextInputUsageProps = ComponentProps<"div">;

export const ContextInputUsage = (props: ContextInputUsageProps) => {
  const { costs, usage } = useContextValue();
  return <UsageRow {...props} cost={costs?.input} label="Input" tokens={usage?.inputTokens ?? 0} />;
};

export type ContextOutputUsageProps = ComponentProps<"div">;

export const ContextOutputUsage = (props: ContextOutputUsageProps) => {
  const { costs, usage } = useContextValue();
  return <UsageRow {...props} cost={costs?.output} label="Output" tokens={usage?.outputTokens ?? 0} />;
};

export type ContextReasoningUsageProps = ComponentProps<"div">;

export const ContextReasoningUsage = (props: ContextReasoningUsageProps) => {
  const { costs, usage } = useContextValue();
  return <UsageRow {...props} cost={costs?.reasoning} label="Reasoning" tokens={usage?.reasoningTokens ?? 0} />;
};

export type ContextCacheUsageProps = ComponentProps<"div">;

export const ContextCacheUsage = (props: ContextCacheUsageProps) => {
  const { costs, usage } = useContextValue();
  return <UsageRow {...props} cost={costs?.cache} label="Cache" tokens={usage?.cachedInputTokens ?? 0} />;
};
