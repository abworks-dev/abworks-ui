"use client";

import { Badge, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@aboard/ui";
import type { MessagePart } from "./message-types";
import { CheckCircleIcon, ChevronDownIcon, CircleIcon, ClockIcon, WrenchIcon, XCircleIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { isValidElement } from "react";
import { CodeBlock } from "./code-block";
import { cn } from "./utils";

export type ToolPart = Extract<MessagePart, { type: "tool-call" }> & { output?: unknown; errorText?: string };
export type ToolState = Extract<MessagePart, { type: "tool-call" }>["status"];
export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible className={cn("group not-prose mb-4 w-full rounded-md border", className)} {...props} />
);

export type ToolHeaderProps = ComponentProps<typeof CollapsibleTrigger> & {
  title?: string;
  tool?: ToolPart;
  type?: "tool-call" | "dynamic-tool";
  state?: ToolState;
  toolName?: string;
};

const statusLabels: Record<ToolState, string> = {
  pending: "Pending",
  running: "Running",
  "waiting-approval": "Awaiting Approval",
  succeeded: "Completed",
  failed: "Error",
};

const statusIcons: Record<ToolState, ReactNode> = {
  pending: <CircleIcon className="size-4" />,
  running: <ClockIcon className="size-4 animate-pulse" />,
  "waiting-approval": <ClockIcon className="size-4 text-yellow-600" />,
  succeeded: <CheckCircleIcon className="size-4 text-green-600" />,
  failed: <XCircleIcon className="size-4 text-red-600" />,
};

export const getStatusBadge = (status: ToolState) => (
  <Badge className="gap-1.5 rounded-full text-xs" variant="secondary">
    {statusIcons[status]}
    {statusLabels[status]}
  </Badge>
);

export const ToolHeader = ({ className, title, tool, type, state, toolName, ...props }: ToolHeaderProps) => {
  const resolvedName = toolName || tool?.toolName || (type === "dynamic-tool" ? "Dynamic tool" : (type ?? tool?.type) === "tool-call" ? "Tool call" : "Tool");
  const resolvedState = state ?? tool?.status ?? "pending";

  return (
    <CollapsibleTrigger className={cn("flex w-full items-center justify-between gap-4 p-3", className)} {...props}>
      <span className="flex items-center gap-2">
        <WrenchIcon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title ?? resolvedName}</span>
        {getStatusBadge(resolvedState)}
      </span>
      <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-open:rotate-180" />
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;
export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent className={cn("space-y-4 p-4 text-popover-foreground outline-none data-open:animate-in data-closed:animate-out", className)} {...props} />
);

export type ToolInputProps = ComponentProps<"div"> & { input: unknown };
export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <div className={cn("space-y-2 overflow-hidden", className)} {...props}>
    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Parameters</h4>
    <div className="rounded-md bg-muted/50"><CodeBlock code={JSON.stringify(input, null, 2)} language="json" /></div>
  </div>
);

export type ToolOutputProps = ComponentProps<"div"> & { output?: unknown; errorText?: string };
export const ToolOutput = ({ className, output, errorText, ...props }: ToolOutputProps) => {
  if (output === undefined && !errorText) return null;
  let rendered: ReactNode = <div>{output as ReactNode}</div>;
  if (typeof output === "object" && output !== null && !isValidElement(output)) rendered = <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />;
  else if (typeof output === "string") rendered = <CodeBlock code={output} language="json" />;
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{errorText ? "Error" : "Result"}</h4>
      <div className={cn("overflow-x-auto rounded-md text-xs [&_table]:w-full", errorText ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-foreground")}>
        {errorText && <div>{errorText}</div>}{rendered}
      </div>
    </div>
  );
};
