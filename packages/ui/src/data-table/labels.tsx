import type { ReactNode } from 'react'

/** Caller-owned presentation strings and formatters; no application locale authority. */
export type DataTableLabels = {
  filterPlaceholder?: string
  reset?: string
  pagination?: string
  rowsPerPage?: string
  pageOf?: (current: number, total: number) => ReactNode
  firstPage?: string
  previousPage?: string
  nextPage?: string
  lastPage?: string
  goToPage?: (page: number) => string
  sortBy?: (label: string) => string
  filterBy?: (label: string) => string
  searchBy?: (label: string) => string
  selectedCount?: (count: number) => ReactNode
  noResults?: ReactNode
  clearFilters?: string
  viewOptions?: string
  view?: ReactNode
  toggleColumns?: ReactNode
  noColumns?: ReactNode
  ascending?: ReactNode
  descending?: ReactNode
  hide?: ReactNode
  clearSelection?: string
  bulkAnnouncement?: (count: number, entity: string) => ReactNode
  bulkActionsFor?: (count: number, entity: string) => string
  selectedItems?: (count: number, entity: string) => string
  selectedSummary?: (count: number, entity: string, countBadge: ReactNode) => ReactNode
}

export const defaultDataTableLabels = {
  filterPlaceholder: 'Filter...',
  reset: 'Reset',
  pagination: 'Pagination',
  rowsPerPage: 'Rows per page',
  pageOf: (current: number, total: number) => `Page ${current} of ${total}`,
  firstPage: 'First page',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  lastPage: 'Last page',
  goToPage: (page: number) => `Go to page ${page}`,
  sortBy: (label: string) => `Sort by ${label}`,
  filterBy: (label: string) => `Filter by ${label}`,
  searchBy: (label: string) => `Search ${label}`,
  selectedCount: (count: number) => `${count} selected`,
  noResults: 'No results.',
  clearFilters: 'Clear filters',
  viewOptions: 'View options',
  view: 'View',
  toggleColumns: 'Toggle columns',
  noColumns: 'No columns',
  ascending: 'Ascending',
  descending: 'Descending',
  hide: 'Hide',
  clearSelection: 'Clear selection',
  bulkAnnouncement: (count: number, entity: string) => `${count} ${entity} selected. Bulk actions available.`,
  bulkActionsFor: (count: number, entity: string) => `Bulk actions for ${count} ${entity}`,
  selectedItems: (count: number, entity: string) => `${count} ${entity} selected`,
  selectedSummary: (count: number, entity: string, countBadge: ReactNode) => <>{countBadge}<span>{entity}</span><span>selected</span></>,
} satisfies Required<DataTableLabels>
