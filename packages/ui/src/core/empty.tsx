// ReUI source adapted from upstream.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/empty.tsx
// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
import type { ComponentProps } from 'react'
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from '../lib/cn'

function Empty({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "cn-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "cn-empty-header flex max-w-sm flex-col items-center",
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "cn-empty-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-empty-media-default",
        icon: "cn-empty-media-icon",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("cn-empty-title cn-font-heading", className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "cn-empty-description text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "cn-empty-content flex w-full max-w-sm min-w-0 flex-col items-center text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
  emptyMediaVariants,
}
