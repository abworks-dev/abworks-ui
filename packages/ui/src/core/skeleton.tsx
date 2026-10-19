// ReUI source adapted from upstream.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/skeleton.tsx
// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("cn-skeleton animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
