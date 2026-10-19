'use client'

import { defaultDataTableLabels, type DataTableLabels } from './labels'

import { RotateCcwIcon } from 'lucide-react'
import { Button } from '../core/button'
import { Input } from '../core/input'
import { cn } from '../lib/cn'

export type DataTableToolbarProps = {
  labels?: DataTableLabels
  children?: React.ReactNode
  searchValue?: string
  searchPlaceholder?: string
  searchAriaLabel?: string
  onSearchChange?: (value: string) => void
  filters?: React.ReactNode
  viewOptions?: React.ReactNode
  isFiltered?: boolean
  onReset?: () => void
  resetLabel?: string
  className?: string
}

export function DataTableToolbar({
  labels,
  children,
  searchValue,
  searchPlaceholder,
  searchAriaLabel,
  onSearchChange,
  filters,
  viewOptions,
  isFiltered = false,
  onReset,
  resetLabel,
  className,
}: DataTableToolbarProps) {
  const text = { ...defaultDataTableLabels, ...labels }
  const filterLabel = searchPlaceholder ?? text.filterPlaceholder
  const resetText = resetLabel ?? text.reset
  const showSearch = onSearchChange !== undefined || searchValue !== undefined
  const showReset = isFiltered && onReset !== undefined

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-2', className)}>
      <div className='flex min-w-0 flex-1 flex-wrap items-center gap-2'>
        {showSearch && <Input type='search' aria-label={searchAriaLabel ?? filterLabel} placeholder={filterLabel} value={searchValue ?? ''} onChange={(event) => onSearchChange?.(event.target.value)} className='h-8 w-full max-w-64' />}
        {filters}
        {showReset && <Button type='button' variant='ghost' size='sm' className='h-8 px-2' onClick={onReset}>{resetText}<RotateCcwIcon aria-hidden='true' /></Button>}
        {children}
      </div>
      {viewOptions}
    </div>
  )
}
