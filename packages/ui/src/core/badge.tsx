import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

// ReUI - MIT License; Copyright (c) 2025 Keenthemes Inc.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry/bases/base/ui/badge.tsx
const badgeVariants = cva('cn-badge group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none', { variants: { variant: { default: 'cn-badge-variant-default', secondary: 'cn-badge-variant-secondary', destructive: 'cn-badge-variant-destructive', outline: 'cn-badge-variant-outline', ghost: 'cn-badge-variant-ghost', link: 'cn-badge-variant-link' } }, defaultVariants: { variant: 'default' } })
type BadgeRenderProps = useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>
export type BadgeProps = BadgeRenderProps
function Badge({ className, variant = 'default', render, ...props }: BadgeProps) { return useRender({ defaultTagName: 'span', props: mergeProps<'span'>({ className: cn(badgeVariants({ variant }), className) }, props), render, state: { slot: 'badge', variant } }) }
export { Badge, badgeVariants }
