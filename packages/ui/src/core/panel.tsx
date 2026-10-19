// ABWorks-native review surface.
//
// Panel is the documented review-surface vocabulary (title, action rail,
// content, footer). It deliberately composes the Card parts instead of owning a
// second surface style, so the Nova surface treatment keeps a single owner and
// Panel only adds structure plus the `data-slot="panel*"` contract.
import type { ComponentProps } from 'react'

import { cn } from '../lib/cn'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

export type PanelProps = ComponentProps<typeof Card> & {
  /** `outline` is the default surface; `muted` lowers emphasis for nested panels. */
  variant?: 'outline' | 'muted'
}

function Panel({ className, variant = 'outline', ...props }: PanelProps) {
  return <Card data-slot='panel' data-variant={variant} className={cn(variant === 'muted' && 'bg-muted/40', className)} {...props} />
}

function PanelHeader({ className, ...props }: ComponentProps<typeof CardHeader>) {
  return <CardHeader data-slot='panel-header' className={className} {...props} />
}

function PanelTitle({ className, ...props }: ComponentProps<typeof CardTitle>) {
  return <CardTitle data-slot='panel-title' className={className} {...props} />
}

function PanelDescription({ className, ...props }: ComponentProps<typeof CardDescription>) {
  return <CardDescription data-slot='panel-description' className={className} {...props} />
}

/** Action rail rendered in the panel header, aligned with the title. */
function PanelActions({ className, ...props }: ComponentProps<typeof CardAction>) {
  return <CardAction data-slot='panel-actions' className={className} {...props} />
}

function PanelContent({ className, ...props }: ComponentProps<typeof CardContent>) {
  return <CardContent data-slot='panel-content' className={className} {...props} />
}

function PanelFooter({ className, ...props }: ComponentProps<typeof CardFooter>) {
  return <CardFooter data-slot='panel-footer' className={className} {...props} />
}

export { Panel, PanelHeader, PanelTitle, PanelDescription, PanelActions, PanelContent, PanelFooter }
