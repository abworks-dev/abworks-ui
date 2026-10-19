import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8')
const core = readFileSync(new URL('../src/core/index.ts', import.meta.url), 'utf8')
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('root barrel exposes layout and new field compositions', () => {
  for (const name of ['Container', 'Stack', 'Grid', 'Panel', 'PageRegions', 'NumberField', 'DateRangePicker']) {
    assert.match(root, new RegExp(`\\b${name}\\b`), `${name} missing from root barrel`)
  }
})

test('core barrel and package subpaths expose field compositions', () => {
  for (const name of ['NumberField', 'DateRangePicker']) {
    assert.match(core, new RegExp(`\\b${name}\\b`), `${name} missing from core barrel`)
  }
  assert.equal(packageJson.exports['./core/number-field'], './src/core/number-field.tsx')
  assert.equal(packageJson.exports['./core/date-range-picker'], './src/core/date-range-picker.tsx')
})

test('Tree compound parts and DataTable have public package entries', () => {
  for (const name of ['Tree', 'TreeItem', 'TreeItemLabel', 'TreeDragLine']) {
    assert.match(root, new RegExp(`\\b${name}\\b`))
    assert.match(core, new RegExp(`\\b${name}\\b`))
  }
  assert.equal(packageJson.exports['./core/tree'], './src/core/tree.tsx')
  assert.equal(packageJson.exports['./data-table'], './src/data-table/index.ts')
  assert.match(root, /export \* from '\.\/data-table'/)
  const styles = readFileSync(new URL('../src/styles/index.css', import.meta.url), 'utf8')
  assert.match(styles, /@source '\.\.\/data-table'/)
  assert.equal(packageJson.dependencies['@headless-tree/core'], '1.7.0')
  assert.equal(packageJson.dependencies['@headless-tree/react'], '1.7.0')
})
