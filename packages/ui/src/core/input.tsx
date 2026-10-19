// ReUI — MIT License; Copyright (c) 2025 Keenthemes Inc.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/input.tsx
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "../lib/cn"

// ABWorks compatibility: preserve the package's existing public InputProps export.
export type InputProps = InputPrimitive.Props & React.ComponentProps<"input">
function Input({ className, type, ...props }: InputProps) { return <InputPrimitive type={type} data-slot="input" className={cn("cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} /> }
export { Input }
