// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
// Source: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/spinner.tsx
// Local adaptations: package-relative imports and lucide-react icons.

import type * as React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "../lib/cn"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
