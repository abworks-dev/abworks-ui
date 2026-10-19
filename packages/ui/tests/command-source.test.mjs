import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const source = readFileSync(new URL('../src/core/command.tsx', import.meta.url), 'utf8')

test('command item keeps internal accessibility state authoritative', () => {
  const item = source.slice(source.indexOf('function CommandItem'))
  assert.match(item, /aria-selected=\{selected\}/)
  assert.match(item, /data-selected=\{selected \? "true" : undefined\}/)
  assert.match(item, /data-focused=\{focused \? "true" : undefined\}/)
  assert.match(item, /context\?\.setFocusedId\(id\)/)
  assert.match(item, /context\?\.setFocusedId\(undefined\)/)
})

test('command registration links accessibility ids', () => {
  assert.match(source, /aria-controls=\{context\?\.listId\}/)
  assert.match(source, /aria-activedescendant=\{context\?\.activeId\}/)
  assert.match(source, /role="listbox"/)
})

test('command retains native filtering and keyboard behavior without Radix', () => {
  assert.match(source, /shouldFilter/)
  assert.match(source, /event\.key === "ArrowDown" \|\| event\.key === "ArrowUp"/)
  assert.match(source, /event\.key === "Enter"/)
  assert.doesNotMatch(source, /@radix|cmdk|data-state|asChild/)
})
