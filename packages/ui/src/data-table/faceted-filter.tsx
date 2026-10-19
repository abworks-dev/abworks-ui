'use client'

import { defaultDataTableLabels, type DataTableLabels } from './labels'

import { CheckIcon, CirclePlusIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { Badge } from '../core/badge'
import { Button } from '../core/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../core/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../core/popover'
import { Separator } from '../core/separator'
import { cn } from '../lib/cn'

export type DataTableFilterOption = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export type DataTableFacetedFilterProps = {
  labels?: DataTableLabels
  title: string
  options: readonly DataTableFilterOption[]
  value?: readonly string[]
  onValueChange?: (value: string[]) => void
  facets?: Readonly<Record<string, number>>
  className?: string
  itemRole?: 'menuitemcheckbox' | 'option'
}

export function DataTableFacetedFilter({
  labels,
  title,
  options,
  value,
  onValueChange,
  facets,
  className,
  itemRole = 'menuitemcheckbox',
}: DataTableFacetedFilterProps) {
  const text = { ...defaultDataTableLabels, ...labels }
  const menuId = useId()
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() =>
    Array.from(value ?? []),
  )
  const selected = value === undefined ? uncontrolledValue : Array.from(value)

  const selectedValues = new Set(selected)
  const updateValue = (nextValue: string[]) => {
    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }
  const toggleValue = (optionValue: string) => {
    const next = new Set(selectedValues)
    if (next.has(optionValue)) next.delete(optionValue)
    else next.add(optionValue)
    const nextValue = Array.from(next)
    updateValue(nextValue)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type='button'
            variant='outline'
            size='sm'
            aria-label={text.filterBy(title.toLowerCase())}
            aria-controls={menuId}
            className={cn('h-8 border-dashed', className)}
          />
        }
      >
        <CirclePlusIcon className='size-4' aria-hidden='true' />
        {title}
        {selectedValues.size > 0 && (
          <>
            <Separator
              orientation='vertical'
              className='mx-2 h-4'
              aria-hidden='true'
            />
            <Badge
              variant='secondary'
              className='rounded-sm px-1 font-normal lg:hidden'
            >
              {selectedValues.size}
            </Badge>
            <div className='hidden space-x-1 lg:flex'>
              {selectedValues.size > 2 ? (
                <Badge
                  variant='secondary'
                  className='rounded-sm px-1 font-normal'
                >
                  {text.selectedCount(selectedValues.size)}
                </Badge>
              ) : (
                options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Badge
                      variant='secondary'
                      key={option.value}
                      className='rounded-sm px-1 font-normal'
                    >
                      {option.label}
                    </Badge>
                  ))
              )}
            </div>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent id={menuId} className='w-50 p-0' align='start'>
        <Command>
          <CommandInput
            placeholder={title}
            aria-label={text.searchBy(title)}
          />
          <CommandList>
            <CommandEmpty>{text.noResults}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                const Icon = option.icon
                return (
                  <CommandItem
                    key={option.value}
                    role={itemRole}
                    aria-label={option.label}
                    aria-checked={
                      itemRole === 'menuitemcheckbox' ? isSelected : undefined
                    }
                    aria-selected={
                      itemRole === 'option' ? isSelected : undefined
                    }
                    onSelect={() => toggleValue(option.value)}
                  >
                    <div
                      data-filter-check
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className='h-4 w-4 text-background' />
                    </div>
                    {Icon && (
                      <Icon
                        className='size-4 text-muted-foreground'
                        aria-hidden='true'
                      />
                    )}
                    <span>{option.label}</span>
                    {facets?.[option.value] !== undefined ? (
                      <span className='ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs'>
                        {facets[option.value]}
                      </span>
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    role='button'
                    aria-label={text.clearFilters}
                    onSelect={() => updateValue([])}
                    className='justify-center text-center'
                  >
                    {text.clearFilters}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
