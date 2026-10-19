'use client'

import { useState, type Ref } from 'react'
import { useTree } from '@headless-tree/react'
import { asyncDataLoaderFeature, dragAndDropFeature, hotkeysCoreFeature, searchFeature, selectionFeature, syncDataLoaderFeature } from '@headless-tree/core'
import { Tree, TreeDragLine, TreeItem, TreeItemLabel } from '../../src/core/tree'

const nodes: Record<string, { name: string; children?: string[] }> = {
  root: { name: 'Root', children: ['folder', 'beta', 'gamma'] },
  folder: { name: 'Documents', children: ['alpha'] },
  alpha: { name: 'Alpha.txt' },
  beta: { name: 'Beta.txt' },
  gamma: { name: 'Gamma.txt' },
}

export function TreeFixture({ asyncLoading = false, itemRef, onItemClick, onDrop }: {
  asyncLoading?: boolean
  itemRef?: Ref<HTMLButtonElement>
  onItemClick?: () => void
  onDrop?: () => void
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [dropCount, setDropCount] = useState(0)
  const tree = useTree<(typeof nodes)[string]>({
    rootItemId: 'root',
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => Boolean(item.getItemData().children),
    state: { selectedItems },
    setSelectedItems,
    createLoadingItemData: () => ({ name: 'Loading' }),
    dataLoader: {
      getItem: (id) => asyncLoading ? Promise.resolve(nodes[id]) : nodes[id],
      getChildren: (id) => asyncLoading ? Promise.resolve(nodes[id].children ?? []) : nodes[id].children ?? [],
    },
    onDrop: () => { setDropCount((count) => count + 1); onDrop?.() },
    features: [asyncLoading ? asyncDataLoaderFeature : syncDataLoaderFeature, hotkeysCoreFeature, selectionFeature, searchFeature, dragAndDropFeature],
  })

  return <div className='relative min-w-0 space-y-2'>
    <Tree tree={tree} aria-label={asyncLoading ? 'Async files' : 'Files'}>
      {tree.getItems().map((item) => <TreeItem
        key={item.getId()}
        item={item}
        ref={item.getId() === 'folder' ? itemRef : undefined}
        indent={item.getId() === 'alpha' ? 28 : undefined}
        onClick={onItemClick}
      ><TreeItemLabel /></TreeItem>)}
      <TreeDragLine />
    </Tree>
    <output aria-label='Selected files'>{selectedItems.join(', ') || 'None'}</output>
    <output aria-label='Dropped files'>{dropCount}</output>
  </div>
}
