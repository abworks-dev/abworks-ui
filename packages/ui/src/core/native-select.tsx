// ReUI is MIT licensed; Copyright (c) 2025 Keenthemes Inc.
// Source: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/native-select.tsx
// Local adaptations: package-relative imports and lucide-react icons.

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "../lib/cn"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" }

function NativeSelect({ className, size = "default", ...props }: NativeSelectProps) {
  return <div className={cn("cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50", className)} data-slot="native-select-wrapper" data-size={size}>
    <select data-slot="native-select" data-size={size} className="cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed" {...props} />
    <ChevronDownIcon className="cn-native-select-icon pointer-events-none absolute select-none" aria-hidden="true" data-slot="native-select-icon" />
  </div>
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) { return <option data-slot="native-select-option" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} /> }
function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) { return <optgroup data-slot="native-select-optgroup" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} /> }

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
