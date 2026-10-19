'use client'

import { Checkbox } from '../core/checkbox'
import { cn } from '../lib/cn'

export type DataTableSelectionCellProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  'checked' | 'onCheckedChange'
> & {
  mode: 'header' | 'row'
  checked?: boolean | 'indeterminate'
  ariaLabel?: string
  onChange?: (checked: boolean) => void
  onCheckedChange?: (checked: boolean) => void
}

/** A table selection control shared by header and row renderers. */
export function DataTableSelectionCell({
  mode,
  checked = false,
  ariaLabel,
  onChange,
  onCheckedChange,
  className,
  ...props
}: DataTableSelectionCellProps) {
  const handleChange = onChange ?? onCheckedChange

  return (
    <Checkbox
      {...props}
      aria-label={ariaLabel ?? props['aria-label']}
      checked={checked === 'indeterminate' ? false : checked}
      indeterminate={checked === 'indeterminate'}
      data-selection-mode={mode}
      className={cn('translate-y-0.5', className)}
      onCheckedChange={(next) => handleChange?.(next)}
    />
  )
}
