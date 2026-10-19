import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const source = readFileSync(new URL('../src/core/date-range-picker.tsx', import.meta.url), 'utf8')
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('DateRangePicker exposes controlled and uncontrolled range contracts', () => {
  assert.match(source, /value\?: DateRange/)
  assert.match(source, /defaultValue\?: DateRange/)
  assert.match(source, /onValueChange\?: \(value: DateRange \| undefined\)/)
  assert.match(source, /hasOwnProperty\.call\(props, "value"\)/)
  assert.match(source, /setUncontrolledValue\(nextValue\)/)
})

test('DateRangePicker delegates calendar behavior to the shared Calendar', () => {
  assert.match(source, /import \{ Calendar \} from "\.\/calendar"/)
  assert.match(source, /<Calendar[\s\S]*mode="range"[\s\S]*selected=\{selected\}[\s\S]*onSelect=/)
  assert.match(source, /numberOfMonths=\{numberOfMonths\}/)
  assert.match(source, /locale=\{locale\}/)
  assert.doesNotMatch(source, /<DayPicker|react-day-picker"\s*$/)
})

test('DateRangePicker uses the package Popover composition and is independently exported', () => {
  assert.match(source, /import \{ Popover, PopoverContent, PopoverTrigger \} from "\.\/popover"/)
  assert.match(source, /render=\{\s*<Button/)
  assert.match(source, /disabled=\{disabled\}/)
  assert.match(source, /aria-label=\{ariaLabel\}/)
  assert.match(source, /updateValue\(undefined\)/)
  assert.equal(packageJson.exports['./core/date-range-picker'], './src/core/date-range-picker.tsx')
})
