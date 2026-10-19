// Aboard-native page skeleton.
//
// Page Regions encodes the documented region order and semantics: a header
// banner, a main column, an optional supporting aside, and a caller-owned
// footer. Regions are real `<header>/<main>/<aside>/<footer>` elements so the
// structure stays navigable without extra ARIA, and the aside collapses below
// the main column until the `lg` breakpoint.
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '../lib/cn'

const gaps = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
} as const

export type PageRegionsProps = ComponentProps<'div'> & {
  /** Banner region rendered above the main content. */
  header?: ReactNode
  /** Supporting region rendered beside the main column from `lg` upwards. */
  aside?: ReactNode
  /** Footer region rendered below the main content; actions stay caller-owned. */
  footer?: ReactNode
  /** Vertical rhythm between regions. */
  gap?: keyof typeof gaps
}

function PageRegions({ className, header, aside, footer, gap = 'md', children, ...props }: PageRegionsProps) {
  return <div data-slot='page-regions' data-gap={gap} className={cn('flex w-full min-w-0 flex-col', gaps[gap], className)} {...props}>
    {header ? <header data-slot='page-region-header' className='min-w-0'>{header}</header> : null}
    <div className={cn('grid min-w-0', gap === 'md' ? 'gap-4' : gaps[gap], aside ? 'lg:grid-cols-[minmax(0,1fr)_18rem]' : undefined)}>
      <main data-slot='page-region-main' className='min-w-0'>{children}</main>
      {aside ? <aside data-slot='page-region-aside' className='min-w-0'>{aside}</aside> : null}
    </div>
    {footer ? <footer data-slot='page-region-footer' className='min-w-0'>{footer}</footer> : null}
  </div>
}

export { PageRegions }
