// ReUI — MIT License; Copyright (c) 2025 Keenthemes Inc.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/label.tsx
"use client"
import * as React from "react"
import { cn } from "../lib/cn"
function Label({ className, ...props }: React.ComponentProps<"label">) { return <label data-slot="label" className={cn("cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed", className)} {...props} /> }
export { Label }
