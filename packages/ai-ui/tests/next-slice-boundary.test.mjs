import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const names = ['agent', 'artifact', 'environment-variables', 'file-tree', 'package-info', 'schema-display', 'snippet', 'stack-trace', 'terminal', 'test-results']
const read = name => readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), 'utf8')

 test('migration slice exports every accepted compound surface', () => {
  const index = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8')
  for (const name of names) assert.match(index, new RegExp(`from ['"]\\./${name}['"]`))
})

test('migration slice is runtime-neutral and uses shared primitives', () => {
  for (const name of names) {
    const source = read(name)
    assert.match(source, /@aboard\/ui\/core|\.\/utils/)
    assert.doesNotMatch(source, /@repo\/shadcn|@radix|cmdk|\basChild\b|data-state|fetch\(|readFile|models\.dev/)
  }
})

test('review fixes preserve safe composition and accessible tree semantics', () => {
  const artifact = read('artifact')
  const tree = read('file-tree')
  const schema = read('schema-display')
  const stack = read('stack-trace')
  assert.match(artifact, /TooltipTrigger render=\{button\}/)
  assert.doesNotMatch(artifact, /<TooltipTrigger>\s*\{button\}/)
  assert.match(tree, /CollapsibleTrigger[\s\S]*render=\{/)
  assert.match(tree, /aria-label=\{`\$\{isExpanded \? "Collapse" : "Expand"\} \$\{name\}`\}/)
  assert.match(tree, /aria-pressed=\{isSelected\}/)
  assert.match(tree, /e\.preventDefault\(\)/)
  assert.doesNotMatch(schema, /dangerouslySetInnerHTML|replaceAll\(/)
  assert.match(schema, /renderPath/)
  assert.doesNotMatch(stack, /data-\[state=/)
  assert.doesNotMatch(stack, /data-\[panel-open\]|data-\[panel-closed\]/)
  assert.match(stack, /data-open:/)
})

test('sensitive display values remain caller-owned', () => {
  const env = read('environment-variables')
  assert.match(env, /value: string/)
  assert.match(env, /onShowValuesChange/)
  assert.match(env, /onCopy\?/)
  assert.doesNotMatch(env, /process\.env|localStorage|sessionStorage/)
})
