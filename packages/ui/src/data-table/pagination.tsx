'use client'

import { defaultDataTableLabels, type DataTableLabels } from './labels'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import { Button } from '../core/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../core/select'
import { cn } from '../lib/cn'
import { getPageNumbers } from './page-numbers'

export type DataTablePaginationProps = {
  labels?: DataTableLabels
  pageIndex: number
  pageCount: number
  pageSize: number
  pageSizeOptions?: readonly number[]
  onPageChange: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeLabel?: string
  leadingContent?: React.ReactNode
  trailingContent?: React.ReactNode
  className?: string
}

export function DataTablePagination({
  labels,
  pageIndex,
  pageCount,
  pageSize,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onPageChange,
  onPageSizeChange,
  pageSizeLabel,
  leadingContent,
  trailingContent,
  className,
}: DataTablePaginationProps) {
  const text = { ...defaultDataTableLabels, ...labels }
  const totalPages = Math.max(1, pageCount)
  const currentPage = Math.min(Math.max(0, pageIndex), totalPages - 1) + 1
  const canPrevious = currentPage > 1
  const canNext = currentPage < totalPages
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <nav
      aria-label={text.pagination}
      className={cn(
        'flex flex-col gap-3 overflow-clip px-2 @3xl/content:flex-row @3xl/content:items-center @3xl/content:justify-between',
        className,
      )}
      style={{ overflowClipMargin: 1 }}
    >
      <div className='flex w-full items-center justify-between gap-4 @3xl/content:w-auto'>
        <div className='flex flex-wrap items-center gap-2'>
          {leadingContent}
          <div className='flex items-center gap-2'>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                if (value != null) onPageSizeChange?.(Number(value))
              }}
            >
              <SelectTrigger
                aria-label={pageSizeLabel ?? text.rowsPerPage}
                size='sm'
                className='h-8 w-17.5'
              >
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent side='top'>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className='hidden text-sm font-medium sm:block'>
              {pageSizeLabel ?? text.rowsPerPage}
            </p>
          </div>
        </div>
        <p className='shrink-0 text-sm font-medium whitespace-nowrap @3xl/content:hidden'>
          {text.pageOf(currentPage, totalPages)}
        </p>
      </div>
      <div className='flex min-w-0 items-center justify-center @3xl/content:justify-end @3xl/content:gap-4'>
        <p className='hidden shrink-0 text-sm font-medium whitespace-nowrap @3xl/content:block'>
          {text.pageOf(currentPage, totalPages)}
        </p>
        <div className='flex items-center space-x-2'>
          <Button
            type='button'
            variant='outline'
            className='size-8 p-0 @max-md/content:hidden'
            aria-label={text.firstPage}
            disabled={!canPrevious}
            onClick={() => onPageChange(0)}
          >
            <ChevronsLeftIcon aria-hidden='true' />
          </Button>
          <Button
            type='button'
            variant='outline'
            className='size-8 p-0'
            aria-label={text.previousPage}
            disabled={!canPrevious}
            onClick={() => onPageChange(Math.max(0, pageIndex - 1))}
          >
            <ChevronLeftIcon aria-hidden='true' />
          </Button>
          <div className='flex items-center space-x-2'>
            {pageNumbers.map((pageNumber, index) =>
              pageNumber === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className='px-1 text-sm text-muted-foreground'
                >
                  ...
                </span>
              ) : (
                <Button
                  key={pageNumber}
                  type='button'
                  variant={currentPage === pageNumber ? 'secondary' : 'outline'}
                  className='h-8 min-w-8 px-2'
                  aria-label={text.goToPage(Number(pageNumber))}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                  onClick={() => onPageChange(Number(pageNumber) - 1)}
                >
                  {pageNumber}
                </Button>
              ),
            )}
          </div>
          <Button
            type='button'
            variant='outline'
            className='size-8 p-0'
            aria-label={text.nextPage}
            disabled={!canNext}
            onClick={() =>
              onPageChange(Math.min(totalPages - 1, pageIndex + 1))
            }
          >
            <ChevronRightIcon aria-hidden='true' />
          </Button>
          <Button
            type='button'
            variant='outline'
            className='size-8 p-0 @max-md/content:hidden'
            aria-label={text.lastPage}
            disabled={!canNext}
            onClick={() => onPageChange(totalPages - 1)}
          >
            <ChevronsRightIcon aria-hidden='true' />
          </Button>
        </div>
        {trailingContent}
      </div>
    </nav>
  )
}
