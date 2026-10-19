"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from "@aboard/ui";
import { Code, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";
import { getStatusBadge, type ToolState } from "./tool";

export type SandboxState = "input-available" | "input-streaming" | "output-available" | "output-error";
export type SandboxRootProps = ComponentProps<typeof Collapsible>;

export const Sandbox = ({ className, ...props }: SandboxRootProps) => (
  <Collapsible className={cn("not-prose group mb-4 w-full overflow-hidden rounded-md border", className)} defaultOpen {...props} />
);

export interface SandboxHeaderProps extends Omit<ComponentProps<typeof CollapsibleTrigger>, "children"> {
  title?: string;
  state: SandboxState;
}

const stateToToolState: Record<SandboxState, ToolState> = {
  "input-available": "running",
  "input-streaming": "pending",
  "output-available": "succeeded",
  "output-error": "failed",
};

const isSandboxState = (value: unknown): value is SandboxState => typeof value === "string" && Object.hasOwn(stateToToolState, value);

export const SandboxHeader = ({ className, title, state, ...props }: SandboxHeaderProps) => {
  const resolvedState = isSandboxState(state) ? state : "input-streaming";
  const accessibleTitle = title?.trim() || "Sandbox";
  return (
    <CollapsibleTrigger className={cn("flex w-full items-center justify-between gap-4 p-3", className)} {...props} aria-label={props["aria-label"] ?? accessibleTitle}>
      <span className="flex items-center gap-2"><Code className="size-4 text-muted-foreground" /><span className="text-sm font-medium">{title}</span>{getStatusBadge(stateToToolState[resolvedState])}</span>
      <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-open:rotate-180" />
    </CollapsibleTrigger>
  );
};

export type SandboxContentProps = ComponentProps<typeof CollapsibleContent>;
export const SandboxContent = ({ className, ...props }: SandboxContentProps) => (
  <CollapsibleContent className={cn("outline-none data-closed:animate-out data-open:animate-in", className)} {...props} />
);

export type SandboxTabsProps = ComponentProps<typeof Tabs>;
export const SandboxTabs = ({ className, ...props }: SandboxTabsProps) => <Tabs className={cn("w-full gap-0", className)} {...props} />;
export type SandboxTabsBarProps = ComponentProps<"div">;
export const SandboxTabsBar = ({ className, ...props }: SandboxTabsBarProps) => <div className={cn("flex w-full items-center border-border border-t border-b", className)} {...props} />;
export type SandboxTabsListProps = ComponentProps<typeof TabsList>;
export const SandboxTabsList = ({ className, ...props }: SandboxTabsListProps) => <TabsList className={cn("h-auto rounded-none border-0 bg-transparent p-0", className)} {...props} />;
export type SandboxTabsTriggerProps = ComponentProps<typeof TabsTrigger>;
export const SandboxTabsTrigger = ({ className, ...props }: SandboxTabsTriggerProps) => <TabsTrigger className={cn("rounded-none border-0 border-transparent border-b-2 px-4 py-2 font-medium text-muted-foreground text-sm transition-colors data-active:border-primary data-active:bg-transparent data-active:text-foreground data-active:shadow-none", className)} {...props} />;
export type SandboxTabContentProps = ComponentProps<typeof TabsContent>;
export const SandboxTabContent = ({ className, ...props }: SandboxTabContentProps) => <TabsContent className={cn("mt-0 text-sm", className)} {...props} />;
