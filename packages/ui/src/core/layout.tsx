// Aboard-native layout primitives.
//
// These are not ReUI adaptations: they were written for Aboard and express the
// declarative layout contract documented under `(ui-system)/layout/stack-grid`.
// They rely on the consumer's semantic theme tokens only (no `.style-nova`
// scope), so they render the same inside and outside a Nova surface, and the
// pinned `style-nova.css` baseline stays untouched.
import { createElement, type ComponentProps } from 'react'

import { cn } from '../lib/cn'

export type LayoutGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type LayoutAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around'

const gapClasses: Record<LayoutGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

const alignClasses: Record<LayoutAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyClasses: Record<LayoutJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

const containerSizes = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  full: 'max-w-none',
} as const

const columnClasses = [
  'grid-cols-1',
  'grid-cols-2',
  'grid-cols-3',
  'grid-cols-4',
  'grid-cols-5',
  'grid-cols-6',
  'grid-cols-7',
  'grid-cols-8',
  'grid-cols-9',
  'grid-cols-10',
  'grid-cols-11',
  'grid-cols-12',
] as const

export type LayoutElement = 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav' | 'ul' | 'ol' | 'li'

export type ContainerProps = ComponentProps<'div'> & {
  /** Maximum inline size of the centered content column. */
  size?: keyof typeof containerSizes
}

function Container({ className, size = 'lg', ...props }: ContainerProps) {
  return createElement('div', {
    'data-slot': 'container',
    'data-size': size,
    className: cn('mx-auto w-full px-4 sm:px-6 lg:px-8', containerSizes[size], className),
    ...props,
  })
}

export type StackProps = ComponentProps<'div'> & {
  direction?: 'vertical' | 'horizontal'
  gap?: LayoutGap
  align?: LayoutAlign
  justify?: LayoutJustify
  wrap?: boolean
  as?: LayoutElement
}

function Stack({ className, direction = 'vertical', gap = 'md', align, justify, wrap = false, as = 'div', ...props }: StackProps) {
  return createElement(as, {
    'data-slot': 'stack',
    'data-direction': direction,
    'data-gap': gap,
    className: cn(
      'flex min-w-0',
      direction === 'vertical' ? 'flex-col' : 'flex-row',
      gapClasses[gap],
      align ? alignClasses[align] : undefined,
      justify ? justifyClasses[justify] : undefined,
      wrap ? 'flex-wrap' : undefined,
      className,
    ),
    ...props,
  })
}

export type GridProps = ComponentProps<'div'> & {
  /** Fixed number of equal columns; ignored when `minItemWidth` is set. */
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: LayoutGap
  align?: LayoutAlign
  /** Evidence-backed content width; produces an auto-fitting responsive grid. */
  minItemWidth?: string
  as?: LayoutElement
}

function Grid({ className, columns = 2, gap = 'md', align, minItemWidth, as = 'div', style, ...props }: GridProps) {
  return createElement(as, {
    'data-slot': 'grid',
    'data-columns': minItemWidth ? 'auto-fit' : String(columns),
    'data-gap': gap,
    className: cn('grid min-w-0', minItemWidth ? undefined : columnClasses[columns - 1], gapClasses[gap], align ? alignClasses[align] : undefined, className),
    style: minItemWidth ? { gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`, ...style } : style,
    ...props,
  })
}

export { Container, Stack, Grid }
