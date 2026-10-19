import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = name => readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), 'utf8')
const readFile = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')
const commit = '6a9d5b1822ffb10bba4bd97175f01edd7d8651cd'

test('Question preserves the fixed upstream compound surface and state modes', () => {
  const source = read('question')
  for (const name of [
    'Question',
    'QuestionPrompt',
    'QuestionDescription',
    'QuestionOptions',
    'QuestionOption',
    'QuestionInput',
    'QuestionActions',
    'QuestionSubmit',
  ]) {
    assert.match(source, new RegExp(`export (?:const|type) ${name}`))
  }
  assert.match(source, /selectionMode\?: SelectionMode/)
  assert.match(source, /selectionMode === "single"/)
  assert.match(source, /currentValues\.filter/)
  assert.match(source, /onSubmit\?:/)
  assert.match(source, /Promise<void>/)
})

test('Question keeps caller-owned submit semantics and empty-response guard', () => {
  const source = read('question')
  assert.match(source, /event\.preventDefault\(\)/)
  assert.match(source, /if \(disabled\)/)
  assert.match(source, /value\.selectedValues\.length === 0 && text\.length === 0/)
  assert.match(source, /await onSubmit\?\./)
  assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|navigator\.clipboard|localStorage/)
})

test('single-choice options preserve radio selection and keyboard navigation semantics', () => {
  const source = read('question')
  assert.match(source, /return isSelected \? currentValues : \[optionValue\]/)
  assert.match(source, /tabIndex=\{role === "radio" \? \(isSelected \? 0 : -1\) : undefined\}/)
  assert.match(source, /ArrowRight.*ArrowDown.*ArrowLeft.*ArrowUp.*Home.*End/)
  assert.match(source, /nextOption\.focus\(\)/)
  assert.match(source, /nextOption\.click\(\)/)
  assert.match(source, /closest\('\[role="radiogroup"\]'\)/)
  const option = source.slice(source.indexOf('export const QuestionOption ='))
  assert.ok(option.indexOf('{...props}') < option.indexOf('aria-checked={isSelected}'))
  assert.ok(option.indexOf('{...props}') < option.indexOf('onKeyDown={handleKeyDown}'))
})

test('Question uses Aboard primitives and provenance remains pinned', () => {
  const source = read('question')
  assert.match(source, /from "@aboard\/ui"/)
  assert.doesNotMatch(source, /@radix|@repo\/shadcn-ui/)
  const sources = readFile('SOURCES.md')
  const packageJson = readFile('package.json')
  const index = readFile('src/index.ts')
  assert.match(sources, /Question.*question\.tsx/)
  assert.match(sources, new RegExp(commit))
  assert.match(sources, /Apache-2\.0/)
  assert.match(packageJson, /"\.\/question": "\.\/src\/question\.tsx"/)
  assert.match(index, /QuestionSubmit.*question/s)
})
