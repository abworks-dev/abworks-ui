'use client'

import { defaultDataTableLabels, type DataTableLabels } from './labels'

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '../core/button'
import { cn } from '../lib/cn'
import type { DataTableSort } from './state'
import type { DataTableSortDirection } from './sort-menu'

export type { DataTableSortDirection }

export type DataTableColumnHeaderProps = {
  labels?: DataTableLabels
  id?: string
  columnId?: string
  title: React.ReactNode
  sort?: DataTableSort | null
  onSortChange?: (sort: DataTableSort | null) => void
  disabled?: boolean
  className?: string
}

function titleText(title: React.ReactNode) {
  if (typeof title === 'string' || typeof title === 'number') return String(title)
  return 'column'
}

export function DataTableColumnHeader({
  labels,
  id,
  columnId,
  title,
  sort,
  onSortChange,
  disabled = false,
  className,
}: DataTableColumnHeaderProps) {
  const text = { ...defaultDataTableLabels, ...labels }
  const stableId = columnId ?? id ?? sort?.id ?? titleText(title).toLocaleLowerCase().replace(/\s+/g, '-')
  const isActive = sort?.id === stableId
  const direction = isActive ? sort?.direction : undefined
  const nextDirection = direction === 'asc' ? 'desc' : 'asc'
  const label = titleText(title)

  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      disabled={disabled || !onSortChange}
      aria-label={text.sortBy(label)}
      aria-pressed={isActive}
      data-sort-direction={direction}
      className={cn('-ms-3 h-8 data-[sort-direction=asc]:text-foreground data-[sort-direction=desc]:text-foreground', className)}
      onClick={() => onSortChange?.({ id: stableId, direction: nextDirection })}
    >
      <span>{title}</span>
      {direction === 'asc' ? <ArrowUpIcon aria-hidden='true' /> : direction === 'desc' ? <ArrowDownIcon aria-hidden='true' /> : <ArrowUpDownIcon aria-hidden='true' />}
    </Button>
  )
}
