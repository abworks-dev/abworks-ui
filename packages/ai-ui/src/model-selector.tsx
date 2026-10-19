// AI Elements - Apache-2.0
// Copyright (c) 2025 Vercel
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/model-selector.tsx
// ABWorks adaptations: Base Nova Dialog/Command; logos are caller-rendered local content and never construct external image URLs.
"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@abworks-dev/ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./utils";

export type ModelSelectorProps = ComponentProps<typeof Dialog>;

export const ModelSelector = (props: ModelSelectorProps) => <Dialog {...props} />;

export type ModelSelectorTriggerProps = ComponentProps<typeof DialogTrigger>;

export const ModelSelectorTrigger = (props: ModelSelectorTriggerProps) => (
  <DialogTrigger {...props} />
);

export type ModelSelectorContentProps = ComponentProps<typeof DialogContent> & {
  title?: ReactNode;
};

export const ModelSelectorContent = ({
  className,
  children,
  title = "Model Selector",
  ...props
}: ModelSelectorContentProps) => (
  <DialogContent
    aria-describedby={undefined}
    className={cn("border-none p-0 outline outline-border", className)}
    showCloseButton={false}
    {...props}
  >
    <DialogTitle className="sr-only">{title}</DialogTitle>
    <Command className="**:data-[slot=command-input-wrapper]:h-auto">
      {children}
    </Command>
  </DialogContent>
);

export type ModelSelectorDialogProps = ComponentProps<typeof CommandDialog>;

export const ModelSelectorDialog = (props: ModelSelectorDialogProps) => (
  <CommandDialog {...props} />
);

export type ModelSelectorInputProps = ComponentProps<typeof CommandInput>;

export const ModelSelectorInput = ({
  className,
  ...props
}: ModelSelectorInputProps) => (
  <CommandInput className={cn("h-auto py-3.5", className)} {...props} />
);

export type ModelSelectorListProps = ComponentProps<typeof CommandList>;

export const ModelSelectorList = (props: ModelSelectorListProps) => (
  <CommandList {...props} />
);

export type ModelSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export const ModelSelectorEmpty = (props: ModelSelectorEmptyProps) => (
  <CommandEmpty {...props} />
);

export type ModelSelectorGroupProps = ComponentProps<typeof CommandGroup>;

export const ModelSelectorGroup = (props: ModelSelectorGroupProps) => (
  <CommandGroup {...props} />
);

export type ModelSelectorItemProps = ComponentProps<typeof CommandItem>;

export const ModelSelectorItem = (props: ModelSelectorItemProps) => (
  <CommandItem {...props} />
);

export type ModelSelectorShortcutProps = ComponentProps<typeof CommandShortcut>;

export const ModelSelectorShortcut = (props: ModelSelectorShortcutProps) => (
  <CommandShortcut {...props} />
);

export type ModelSelectorSeparatorProps = ComponentProps<typeof CommandSeparator>;

export const ModelSelectorSeparator = (props: ModelSelectorSeparatorProps) => (
  <CommandSeparator {...props} />
);

export type ModelSelectorProvider =
  | "moonshotai-cn"
  | "lucidquery"
  | "moonshotai"
  | "zai-coding-plan"
  | "alibaba"
  | "xai"
  | "vultr"
  | "nvidia"
  | "upstage"
  | "groq"
  | "github-copilot"
  | "mistral"
  | "vercel"
  | "nebius"
  | "deepseek"
  | "alibaba-cn"
  | "google-vertex-anthropic"
  | "venice"
  | "chutes"
  | "cortecs"
  | "github-models"
  | "togetherai"
  | "azure"
  | "baseten"
  | "huggingface"
  | "opencode"
  | "fastrouter"
  | "google"
  | "google-vertex"
  | "cloudflare-workers-ai"
  | "inception"
  | "wandb"
  | "openai"
  | "zhipuai-coding-plan"
  | "perplexity"
  | "openrouter"
  | "zenmux"
  | "v0"
  | "iflowcn"
  | "synthetic"
  | "deepinfra"
  | "zhipuai"
  | "submodel"
  | "zai"
  | "inference"
  | "requesty"
  | "morph"
  | "lmstudio"
  | "anthropic"
  | "aihubmix"
  | "fireworks-ai"
  | "modelscope"
  | "llama"
  | "scaleway"
  | "amazon-bedrock"
  | "cerebras"
  // Intentional pattern for autocomplete-friendly string union.
  | (string & {});

export type ModelSelectorLogoProps = ComponentProps<"span"> & {
  provider: ModelSelectorProvider;
  children?: ReactNode;
};

export const ModelSelectorLogo = ({
  provider,
  className,
  children,
  ...props
}: ModelSelectorLogoProps) => (
  <span
    aria-label={`${provider} logo`}
    className={cn("inline-flex size-3 shrink-0 items-center justify-center", className)}
    role="img"
    {...props}
  >
    {children}
  </span>
);

export type ModelSelectorLogoGroupProps = ComponentProps<"div">;

export const ModelSelectorLogoGroup = ({
  className,
  ...props
}: ModelSelectorLogoGroupProps) => (
  <div
    className={cn(
      "flex shrink-0 items-center -space-x-1 [&>img]:rounded-full [&>img]:bg-background [&>img]:p-px [&>img]:ring-1 [&>span]:rounded-full [&>span]:bg-background [&>span]:p-px [&>span]:ring-1 dark:[&>img]:bg-foreground dark:[&>span]:bg-foreground",
      className
    )}
    {...props}
  />
);

export type ModelSelectorNameProps = ComponentProps<"span">;

export const ModelSelectorName = ({
  className,
  ...props
}: ModelSelectorNameProps) => (
  <span className={cn("flex-1 truncate text-left", className)} {...props} />
);
