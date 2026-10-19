// ReUI source adapted from upstream.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/textarea.tsx
// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
import type { ComponentProps } from 'react'

import { cn } from '../lib/cn'

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
