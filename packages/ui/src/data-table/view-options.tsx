'use client'

import { defaultDataTableLabels, type DataTableLabels } from './labels'

import { SlidersHorizontalIcon } from 'lucide-react'
import { Button } from '../core/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '../core/dropdown-menu'
import { cn } from '../lib/cn'

export type DataTableViewOption = {
  id: string
  label: string
  visible: boolean
  disabled?: boolean
}

export type DataTableViewOptionsProps = {
  labels?: DataTableLabels
  options: readonly DataTableViewOption[]
  onVisibilityChange: (id: string, visible: boolean) => void
  ariaLabel?: string
  className?: string
}

export function DataTableViewOptions({ options, onVisibilityChange, ariaLabel, className, labels }: DataTableViewOptionsProps) {
  const text = { ...defaultDataTableLabels, ...labels }
  const label = ariaLabel ?? text.viewOptions
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger render={<Button type='button' variant='outline' size='sm' aria-label={label} className={cn('ms-auto hidden h-8 lg:flex', className)} />}>
        <SlidersHorizontalIcon aria-hidden='true' />
        {text.view}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-37.5'>
        <div className='px-2 py-1.5 text-sm font-medium'>{text.toggleColumns}</div>
        <DropdownMenuSeparator />
        {options.map((option) => <DropdownMenuCheckboxItem key={option.id} checked={option.visible} disabled={option.disabled} onCheckedChange={(checked) => onVisibilityChange(option.id, Boolean(checked))}>{option.label}</DropdownMenuCheckboxItem>)}
        {options.length === 0 && <p className='px-2 py-1.5 text-sm text-muted-foreground'>{text.noColumns}</p>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
