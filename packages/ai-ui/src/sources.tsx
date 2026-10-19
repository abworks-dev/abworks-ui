"use client"

// Apache-2.0 (upstream repository)
// Source: https://github.com/vercel/ai-elements/blob/6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/packages/elements/src/sources.tsx

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@aboard/ui/core/collapsible"
import { cn } from "./utils"
import { BookIcon, ChevronDownIcon } from "lucide-react"
import type { ComponentProps } from "react"

// Base UI adaptation: expose the actual Collapsible controlled-state contract.
export type SourcesProps = ComponentProps<typeof Collapsible>

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn("not-prose mb-4 text-primary text-xs", className)}
    {...props}
  />
)

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number
}

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    className={cn("flex items-center gap-2", className)}
    {...props}
  >
    {children ?? (
      <>
        <p className="font-medium">Used {count} sources</p>
        <ChevronDownIcon className="h-4 w-4" />
      </>
    )}
  </CollapsibleTrigger>
)

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      "mt-3 flex w-fit flex-col gap-2",
      "data-[ending-style]:fade-out-0 data-[ending-style]:slide-out-to-top-2 data-[starting-style]:slide-in-from-top-2 outline-none data-[ending-style]:animate-out data-[open]:animate-in",
      className,
    )}
    {...props}
  />
)

export type SourceProps = ComponentProps<"a">

export const Source = ({ href, title, children, ...props }: SourceProps) => (
  <a
    className="flex items-center gap-2"
    href={href}
    rel="noreferrer"
    target="_blank"
    {...props}
  >
    {children ?? (
      <>
        <BookIcon className="h-4 w-4" />
        <span className="block font-medium">{title}</span>
      </>
    )}
  </a>
)
