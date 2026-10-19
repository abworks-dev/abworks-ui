'use client'

import { defaultDataTableLabels, type DataTableLabels } from './labels'

import { XIcon } from 'lucide-react'
import { useId, useRef } from 'react'
import { Badge } from '../core/badge'
import { Button } from '../core/button'
import { Separator } from '../core/separator'
import { cn } from '../lib/cn'

export type DataTableBulkActionsProps = {
  labels?: DataTableLabels
  selectedCount: number
  entityName?: string
  entityNamePlural?: string
  selectionEntityName?: string
  selectionEntityNamePlural?: string
  onClearSelection?: () => void
  children?: React.ReactNode
  className?: string
}

export function DataTableBulkActions({
  labels,
  selectedCount,
  entityName = 'row',
  entityNamePlural = `${entityName}s`,
  selectionEntityName = entityName,
  selectionEntityNamePlural = entityNamePlural,
  onClearSelection,
  children,
  className,
}: DataTableBulkActionsProps) {
  const text = { ...defaultDataTableLabels, ...labels }
  const toolbarRef = useRef<HTMLDivElement>(null)
  const descriptionId = useId()

  if (selectedCount <= 0) return null

  const clearSelection = () => onClearSelection?.()

  const entity = selectedCount === 1 ? entityName : entityNamePlural
  const selectionEntity =
    selectedCount === 1 ? selectionEntityName : selectionEntityNamePlural
  const announcement = text.bulkAnnouncement(selectedCount, entity)

  return (
    <>
      <div
        key={`${selectedCount}-${entity}`}
        aria-live='polite'
        aria-atomic='true'
        className='sr-only'
        role='status'
      >
        {announcement}
      </div>
      <div
        ref={toolbarRef}
        role='toolbar'
        aria-label={text.bulkActionsFor(selectedCount, entity)}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={cn(
          'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl',
          'transition-all delay-100 duration-300 ease-out hover:scale-105',
          'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
          className,
        )}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            const target = event.target as HTMLElement
            const activeElement = document.activeElement as HTMLElement
            const inDropdown =
              target?.closest(
                '[data-slot="dropdown-menu-trigger"],[data-slot="dropdown-menu-content"]',
              ) ||
              activeElement?.closest(
                '[data-slot="dropdown-menu-trigger"],[data-slot="dropdown-menu-content"]',
              )
            if (inDropdown) return
            event.preventDefault()
            clearSelection()
          }
          if (!toolbarRef.current) return
          const buttons = Array.from(
            toolbarRef.current.querySelectorAll<HTMLButtonElement>(
              'button:not(:disabled)',
            ),
          )
          const currentIndex = buttons.indexOf(
            document.activeElement as HTMLButtonElement,
          )
          if (currentIndex < 0 || buttons.length === 0) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault()
            const next =
              event.key === 'ArrowRight'
                ? (currentIndex + 1) % buttons.length
                : (currentIndex - 1 + buttons.length) % buttons.length
            buttons[next]?.focus()
          }
          if (event.key === 'Home') {
            event.preventDefault()
            buttons[0]?.focus()
          }
          if (event.key === 'End') {
            event.preventDefault()
            buttons.at(-1)?.focus()
          }
        }}
      >
        <div className='flex items-center gap-x-2 rounded-xl border bg-background/95 p-2 shadow-xl backdrop-blur-lg supports-backdrop-filter:bg-background/60'>
          {onClearSelection && (
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='size-6 rounded-full'
              aria-label={text.clearSelection}
              title={text.clearSelection}
              onClick={clearSelection}
            >
              <XIcon aria-hidden='true' />
              <span className='sr-only'>
                {text.clearSelection}
              </span>
            </Button>
          )}
          {onClearSelection && (
            <Separator
              orientation='vertical'
              className='h-5'
              aria-hidden='true'
            />
          )}
          <div
            className='flex items-center gap-x-1 text-sm'
            id={descriptionId}
            aria-label={text.selectedItems(selectedCount, selectionEntity)}
          >
            {text.selectedSummary(selectedCount, selectionEntity, (
                <Badge variant='default' className='min-w-8 rounded-lg'>
                  {selectedCount}
                </Badge>
              ))}
          </div>
          {children && (
            <Separator
              orientation='vertical'
              className='h-5'
              aria-hidden='true'
            />
          )}
          {children}
        </div>
      </div>
    </>
  )
}
