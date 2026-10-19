import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = name => readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), 'utf8')
const readFile = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
const aiElementsCommit = '6a9d5b1822ffb10bba4bd97175f01edd7d8651cd'

test('queue uses shared ScrollArea and preserves keyboard-visible actions and count zero', () => {
  const source = read('queue')
  assert.match(source, /ScrollArea/)
  assert.match(source, /ComponentProps<typeof ScrollArea>/)
  assert.match(source, /group-focus-within:opacity-100/)
  assert.match(source, /focus-visible:opacity-100/)
  assert.match(source, /count !== undefined/)
})

test('first-slice components preserve presentation-only boundaries', () => {
  for (const name of ['checkpoint', 'context', 'queue', 'model-selector']) {
    const source = read(name)
    assert.doesNotMatch(source, /@radix|cmdk|data-state|asChild|fetch\(|XMLHttpRequest/)
  }
  assert.doesNotMatch(read('model-selector'), /models\.dev\/logos/)
  assert.doesNotMatch(read('context'), /tokenlens/)
})

test('code block delegates copying to the caller', () => {
  const source = read('code-block')
  assert.match(source, /onCopy\?: \(code: string\) => void \| Promise<void>/)
  assert.match(source, /await onCopy\(code\)/)
  assert.match(source, /No copy callback provided/)
  assert.doesNotMatch(source, /navigator\.clipboard|writeText\(/)
})

test('AI Elements provenance remains pinned and carries source metadata', () => {
  const sources = readFile('SOURCES.md')
  const provenance = readFile('src/provenance.ts')
  for (const source of [sources, provenance]) {
    assert.match(source, new RegExp(aiElementsCommit))
    assert.match(source, /Apache-2\.0/)
    assert.match(source, /vercel\/ai-elements/)
    assert.match(source, /packages\/elements\/src/)
  }
})
