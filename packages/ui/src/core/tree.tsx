// ReUI - MIT License; Copyright (c) 2025 Keenthemes Inc.
// Upstream: https://github.com/keenthemes/reui/blob/8a2c701eaf95729f238274d5ce2555a5a8bd23e7/registry-reui/bases/base/reui/tree.tsx
// Local adaptations: Base UI composition, package-relative imports, Lucide icons,
// semantic tokens, logical positioning, and accessibility fixes.
"use client"

import { createContext, useContext } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import type { ItemInstance, TreeInstance } from "@headless-tree/core"
import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react"

import { cn } from "../lib/cn"

type ToggleIconType = "chevron" | "plus-minus"

interface TreeContextValue<T> {
  indent: number
  currentItem?: ItemInstance<T>
  tree?: TreeInstance<T>
  toggleIconType: ToggleIconType
}

const TreeContext = createContext<TreeContextValue<unknown>>({
  indent: 20,
  currentItem: undefined,
  tree: undefined,
  toggleIconType: "plus-minus",
})

function useTreeContext<T>() {
  return useContext(TreeContext) as TreeContextValue<T>
}

export interface TreeProps<T = unknown>
  extends React.HTMLAttributes<HTMLDivElement> {
  indent?: number
  tree?: TreeInstance<T>
  toggleIconType?: ToggleIconType
}

function Tree<T = unknown>({
  indent = 20,
  tree,
  className,
  style,
  toggleIconType = "chevron",
  ...props
}: TreeProps<T>) {
  const containerProps = (tree?.getContainerProps?.() ?? {}) as React.ComponentProps<"div">
  const mergedProps = mergeProps<"div">(containerProps, props)

  return (
    <TreeContext.Provider
      value={{ indent, tree, toggleIconType } as unknown as TreeContextValue<unknown>}
    >
      <div
        {...mergedProps}
        data-slot="tree"
        style={{ ...mergedProps.style, ...style, "--tree-indent": `${indent}px` } as React.CSSProperties}
        className={cn("cn-tree flex flex-col", mergedProps.className, className)}
      />
    </TreeContext.Provider>
  )
}

export interface TreeItemProps<T = unknown>
  extends Omit<useRender.ComponentProps<"button">, "indent"> {
  item: ItemInstance<T>
  indent?: number
}

function TreeItem<T = unknown>({
  item,
  indent: itemIndent,
  className,
  render,
  ref,
  children,
  style,
  ...props
}: TreeItemProps<T>) {
  const parentContext = useTreeContext<T>()
  const indent = itemIndent ?? parentContext.indent
  const itemProps = item.getProps() as React.ComponentProps<"button">
  const { ref: itemRef, ...engineProps } = itemProps
  const mergedProps = mergeProps<"button">(
    {
      type: "button",
      "data-slot": "tree-item",
      "data-focus": item.isFocused() || undefined,
      "data-folder": item.isFolder() || undefined,
      "data-selected": item.isSelected?.() || undefined,
      "data-drag-target": item.isDragTarget?.() || undefined,
      "data-search-match": item.isMatchingSearch?.() || undefined,
      "aria-expanded": item.isFolder() ? item.isExpanded() : undefined,
      style: {
        "--tree-padding": `${item.getItemMeta().level * indent}px`,
      } as React.CSSProperties,
      className: cn(
        "cn-tree-item z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      ),
    } as unknown as React.ComponentProps<"button">,
    engineProps,
    { ...props, children, style, className },
  )

  return (
    <TreeContext.Provider
      value={{ ...parentContext, currentItem: item } as unknown as TreeContextValue<unknown>}
    >
      {useRender({
        defaultTagName: "button",
        render,
        ref:
          itemRef && ref
            ? [itemRef, ref]
            : itemRef ?? ref,
        props: mergedProps,
      })}
    </TreeContext.Provider>
  )
}

export interface TreeItemLabelProps<T = unknown>
  extends React.HTMLAttributes<HTMLSpanElement> {
  item?: ItemInstance<T>
}

function TreeItemLabel<T = unknown>({
  item: propItem,
  children,
  className,
  ...props
}: TreeItemLabelProps<T>) {
  const { currentItem, toggleIconType } = useTreeContext<T>()
  const item = propItem ?? currentItem

  if (!item) {
    console.warn("TreeItemLabel: No item provided via props or context")
    return null
  }

  return (
    <span
      data-slot="tree-item-label"
      className={cn(
        "cn-tree-item-label in-focus-visible:ring-ring/50 bg-background hover:bg-accent in-data-[selected=true]:bg-accent in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent flex items-center gap-1 transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] in-data-[search-match=true]:bg-accent [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "py-1.5 px-2 text-sm rounded-md",
        className,
      )}
      {...props}
    >
      {item.isFolder() &&
        (toggleIconType === "plus-minus" ? (
          item.isExpanded() ? (
            <MinusIcon aria-hidden="true" className="text-muted-foreground size-3.5" strokeWidth={1} />
          ) : (
            <PlusIcon aria-hidden="true" className="text-muted-foreground size-3.5" strokeWidth={1} />
          )
        ) : (
          <ChevronDownIcon
            aria-hidden="true"
            className="text-muted-foreground size-4 in-aria-[expanded=false]:-rotate-90 rtl:in-aria-[expanded=false]:rotate-90"
          />
        ))}
      {children ?? item.getItemName()}
    </span>
  )
}

export interface TreeDragLineProps extends React.HTMLAttributes<HTMLDivElement> {}

function TreeDragLine({ className, ...props }: TreeDragLineProps) {
  const { tree } = useTreeContext<unknown>()

  if (!tree?.getDragLineStyle) {
    console.warn(
      "TreeDragLine: No tree provided via context or tree does not have getDragLineStyle method",
    )
    return null
  }

  return (
    <div
      style={tree.getDragLineStyle()}
      className={cn(
        "cn-tree-drag-line bg-primary before:bg-background before:border-primary absolute z-30 -mt-px h-0.5 w-[unset] before:absolute before:-top-[3px] before:inset-s-0 before:size-2 before:border-2 before:rounded-full",
        className,
      )}
      {...props}
    />
  )
}

export { Tree, TreeItem, TreeItemLabel, TreeDragLine }
