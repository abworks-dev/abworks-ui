'use client'

import { defaultDataTableLabels, type DataTableLabels } from './labels'

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '../core/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../core/dropdown-menu'

export type DataTableSortDirection = 'asc' | 'desc'

export type DataTableSortMenuProps = {
  labels?: DataTableLabels
  label?: React.ReactNode
  title?: React.ReactNode
  direction?: DataTableSortDirection
  onSort: (direction: DataTableSortDirection) => void
  onHide?: () => void
}

function labelText(value: React.ReactNode) {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return 'column'
}

export function DataTableSortMenu({ label, title, direction, onSort, onHide, labels }: DataTableSortMenuProps) {
  const text = { ...defaultDataTableLabels, ...labels }
  const displayLabel = label ?? title ?? 'column'
  const accessibleLabel = labelText(displayLabel)

  return (
    <div data-table-sort-menu className='flex items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-8 data-[popup-open]:bg-accent'
              aria-label={text.sortBy(accessibleLabel)}
            />
          }
        >
          <span>{displayLabel}</span>
          {direction === 'desc' ? (
            <ArrowDownIcon className='ms-2 size-4' aria-hidden='true' />
          ) : direction === 'asc' ? (
            <ArrowUpIcon className='ms-2 size-4' aria-hidden='true' />
          ) : (
            <ArrowUpDownIcon className='ms-2 size-4' aria-hidden='true' />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          <DropdownMenuItem onClick={() => onSort('asc')}>
            <ArrowUpIcon className='size-3.5 text-muted-foreground/70' aria-hidden='true' />
            {text.ascending}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('desc')}>
            <ArrowDownIcon className='size-3.5 text-muted-foreground/70' aria-hidden='true' />
            {text.descending}
          </DropdownMenuItem>
          {onHide && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onHide}>
                <EyeOffIcon className='size-3.5 text-muted-foreground/70' aria-hidden='true' />
                {text.hide}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
