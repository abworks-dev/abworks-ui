import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import assert from 'node:assert/strict'

const root = path.resolve(import.meta.dirname, '..', 'src', 'data-table')

test('canonical data-table tree has no application translation authority', () => {
  for (const file of fs.readdirSync(root).filter((name) => /\.(tsx?|mjs)$/.test(name))) {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    assert.doesNotMatch(source, /@\//)
    assert.doesNotMatch(source, /useAppTranslations|next-intl|messages\//)
  }
})

test('pagination helper preserves the Workbench page window contract', async () => {
  const source = fs.readFileSync(path.join(root, 'page-numbers.ts'), 'utf8')
  assert.match(source, /totalPages <= 5/)
  assert.match(source, /currentPage - 1, currentPage, currentPage \+ 1/)
})
