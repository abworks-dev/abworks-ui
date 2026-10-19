import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const sheet = readFileSync(new URL('../src/core/sheet.tsx', import.meta.url), 'utf8')
const drawer = readFileSync(new URL('../src/core/drawer.tsx', import.meta.url), 'utf8')

function classesFor(source, prefix) {
  const classes = source.match(new RegExp(`"(${prefix} [^"\\n]+)"`))?.[1]
  assert.ok(classes, `Missing ${prefix} classes`)
  return classes.split(/\s+/)
}

test('Sheet owns its translate and opacity transition without theme timing dependencies', () => {
  const classes = classesFor(sheet, 'cn-sheet-content')
  for (const token of [
    'transition-[translate,opacity]', 'duration-200', 'ease-in-out',
    'data-starting-style:opacity-0', 'data-ending-style:opacity-0',
  ]) assert.ok(classes.includes(token), `Missing ${token}`)
})

test('Sheet preserves entry and exit translations on all four sides and RTL', () => {
  for (const [side, translation] of [
    ['right', 'translate-x-full'], ['left', '-translate-x-full'],
    ['top', '-translate-y-full'], ['bottom', 'translate-y-full'],
  ]) {
    for (const state of ['starting-style', 'ending-style']) {
      assert.ok(sheet.includes(`data-[side=${side}]:data-${state}:${translation}`))
    }
  }
  for (const [side, translation] of [['right', '-translate-x-full'], ['left', 'translate-x-full']]) {
    for (const state of ['starting-style', 'ending-style']) {
      assert.ok(sheet.includes(`rtl:data-[side=${side}]:data-${state}:${translation}`))
    }
  }
})

test('all animated Sheet and Drawer surfaces override transitions under reduced motion', () => {
  for (const [source, prefix] of [
    [sheet, 'cn-sheet-overlay'], [sheet, 'cn-sheet-content'],
    [drawer, 'cn-drawer-overlay'], [drawer, 'cn-drawer-popup'],
    [drawer, 'cn-drawer-content-base'], [drawer, 'cn-drawer-swipe-handle'],
  ]) {
    assert.ok(classesFor(source, prefix).includes('motion-reduce:transition-none!'), prefix)
  }
})

test('Drawer retains its transform lifecycle and gesture-specific timing', () => {
  assert.ok(drawer.includes('transition-[transform,height,opacity,filter] duration-450'))
  for (const token of [
    'data-starting-style:transform-(--closed-transform)',
    'data-ending-style:transform-(--closed-transform)',
    'data-swiping:duration-0',
    'data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
    'group-data-swiping/drawer-popup:select-none',
  ]) assert.ok(drawer.includes(token), `Missing ${token}`)
})
