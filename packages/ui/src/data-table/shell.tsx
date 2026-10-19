'use client'

import { defaultDataTableLabels, type DataTableLabels } from './labels'

import { Fragment } from 'react'
// Specialized exception: this shell composes Base UI parts directly to keep two externally
// positioned, keepMounted scrollbar gutters aligned with the sticky table header. Ordinary
// scrolling uses @aboard/ui/core/scroll-area.
import { ScrollArea } from '@base-ui/react/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../core/table'
import { cn } from '../lib/cn'
import type { DataTableSelection } from './state'

export type DataTableShellHeaderContext = {
  allSelected: boolean
  someSelected: boolean
  onChange: (checked: boolean) => void
}

export type DataTableShellRowContext = {
  id: string
  selected: boolean
  onChange: (checked: boolean) => void
}

export type DataTableShellProps<T> = {
  labels?: DataTableLabels
  className?: string
  rows: readonly T[]
  getRowId: (row: T) => string
  selectedIds: DataTableSelection
  onToggleAll: (checked: boolean) => void
  onToggle: (id: string, checked: boolean) => void
  ariaLabel: string
  tableClassName?: string
  stickyHeader?: boolean
  emptyMessage?: React.ReactNode
  emptyColSpan?: number
  renderHeader: (context: DataTableShellHeaderContext) => React.ReactNode
  renderRow: (
    row: T,
    selected: boolean,
    onChange: (checked: boolean) => void,
  ) => React.ReactNode
}

/** Provides the shared table frame while feature renderers own cells and row markup. */
export function DataTableShell<T>({
  labels,
  className,
  rows,
  getRowId,
  selectedIds,
  onToggleAll,
  onToggle,
  ariaLabel,
  tableClassName,
  stickyHeader = false,
  emptyMessage,
  emptyColSpan = 1,
  renderHeader,
  renderRow,
}: DataTableShellProps<T>) {
  const text = { ...defaultDataTableLabels, ...labels }
  const resolvedEmptyMessage = emptyMessage ?? text.noResults
  const allSelected =
    rows.length > 0 && rows.every((row) => Boolean(selectedIds[getRowId(row)]))
  const someSelected =
    rows.some((row) => Boolean(selectedIds[getRowId(row)])) && !allSelected

  return (
    <div
      data-table-shell
      data-sticky-header={stickyHeader ? 'true' : undefined}
      className={cn('relative overflow-hidden rounded-md border', className)}
    >
      {stickyHeader && (
        <div
          aria-hidden='true'
          data-table-header-surface
          className='pointer-events-none absolute inset-x-0 top-0 z-10 h-10 border-b bg-card'
        />
      )}
      <ScrollArea.Root className='relative h-full'>
        <ScrollArea.Viewport
          data-table-scroll-region
          className='no-scrollbar h-full overscroll-contain px-[0.7rem] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'
        >
          <ScrollArea.Content className='min-w-full [&>[data-slot="table-container"]]:overflow-visible'>
            <Table className={cn(tableClassName)} aria-label={ariaLabel}>
              <TableHeader
                className={cn(
                  stickyHeader &&
                    'sticky top-0 z-20 bg-transparent [&_tr]:border-b-0 [&_tr]:hover:bg-transparent',
                )}
              >
                {renderHeader({
                  allSelected,
                  someSelected,
                  onChange: onToggleAll,
                })}
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={emptyColSpan}
                      className='h-24 text-center'
                    >
                      {resolvedEmptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => {
                    const id = getRowId(row)
                    const selected = Boolean(selectedIds[id])
                    return (
                      <Fragment key={id}>
                        {renderRow(row, selected, (checked) =>
                          onToggle(id, checked),
                        )}
                      </Fragment>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <div
          data-table-scrollbar='vertical'
          className='absolute top-10 end-0 bottom-0 z-30 w-[0.7rem]'
        >
          <ScrollArea.Scrollbar
            orientation='vertical'
            keepMounted
            className='absolute inset-0 hidden touch-none select-none p-0.5 data-[has-overflow-y]:flex'
          >
            <ScrollArea.Thumb className='w-full rounded-full bg-border hover:bg-muted-foreground' />
          </ScrollArea.Scrollbar>
        </div>
        <div
          data-table-scrollbar='horizontal'
          className='absolute inset-x-[0.7rem] bottom-0 z-30 h-[0.7rem]'
        >
          <ScrollArea.Scrollbar
            orientation='horizontal'
            keepMounted
            className='absolute inset-0 hidden touch-none select-none border-t bg-card p-0.5 data-[has-overflow-x]:flex'
          >
            <ScrollArea.Thumb className='h-full rounded-full bg-border hover:bg-muted-foreground' />
          </ScrollArea.Scrollbar>
        </div>
      </ScrollArea.Root>
    </div>
  )
}
