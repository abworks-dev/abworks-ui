import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = name => readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), 'utf8')
const readFile = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')

test('sandbox is a Base UI, read-only status surface', () => {
  const source = read('sandbox')
  assert.match(source, /SandboxState/)
  assert.match(source, /stateToToolState/)
  assert.match(source, /isSandboxState/)
  assert.match(source, /accessibleTitle = .*Sandbox/)
  assert.match(source, /aria-label=.*accessibleTitle/)
  assert.match(source, /@abworks-dev\/ui/)
  assert.doesNotMatch(source, /@radix|cmdk|asChild|data-state|fetch\(|readFile|process\.env|navigator\./)
})

test('commit is a DTO renderer with caller-owned copy', () => {
  const source = read('commit')
  assert.match(source, /onCopy\?: \(hash: string\) => void/)
  assert.match(source, /onCopy\(hash\)/)
  assert.match(source, /aria-label=.*Copy commit hash/)
  assert.match(source, /onCopyError\?: \(error: unknown\) => void/)
  assert.match(source, /copiedResetMs\?: number/)
  assert.match(source, /try \{ onCopy\(hash\); setIsCopied\(true\); \} catch/)
  assert.match(source, /Number\.isFinite\(count\)/)
  assert.match(source, /validDate = date instanceof Date && Number\.isFinite\(date\.getTime\(\)\)/)
  assert.match(source, /Object\.hasOwn\(fileStatusStyles, status\)/)
  assert.doesNotMatch(source, /navigator\.clipboard|@radix|cmdk|asChild|data-state|fetch\(|readFile|process\.env|git /)
})

test('sandbox and commit have root and subpath exports', () => {
  const index = readFile('src/index.ts')
  const pkg = readFile('package.json')
  for (const name of ['sandbox', 'commit']) {
    assert.match(index, new RegExp(`from ['"]\\./${name}['"]`))
    assert.match(pkg, new RegExp(`\\"\\./${name}\\"`))
  }
})

test('provenance records both fixed-commit ports', () => {
  const sources = readFile('SOURCES.md')
  const provenance = readFile('src/provenance.ts')
  for (const source of [sources, provenance]) {
    assert.match(source, /6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/)
    assert.match(source, /Apache-2\.0/)
  }
  assert.match(sources, /Sandbox.*Base UI Collapsible\/Tabs/)
  assert.match(sources, /Commit.*caller-owned DTOs/)
})
