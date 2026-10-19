import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = name => readFileSync(new URL(`../src/${name}.tsx`, import.meta.url), 'utf8')
const readFile = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8')

test('audio slice stays runtime-neutral', () => {
  for (const name of ['audio-player', 'transcription', 'voice-selector']) {
    assert.doesNotMatch(read(name), /@radix|cmdk|data-state|asChild|fetch\(|XMLHttpRequest|localStorage|sessionStorage/)
  }
})

test('audio player has explicit caller-owned contracts', () => {
  const source = read('audio-player')
  assert.match(source, /AudioPlayerElementData/)
  assert.match(source, /mediaType.*base64/)
  assert.match(source, /controls\?: boolean/)
  assert.match(source, /preload\?: ComponentProps<"audio">\["preload"\]/)
  assert.match(source, /controls = false, preload = "metadata"/)
  assert.match(source, /controls=\{controls\}.*preload=\{preload\}/)
  assert.doesNotMatch(source, /new Audio/)
  assert.match(source, /audio\.play\(\)/)
  assert.match(source, /audio\.pause\(\)/)
  assert.match(source, /seekOffset\?: number/)
  assert.match(source, /currentTime.*duration.*volume.*muted.*playing/)
  assert.match(source, /audioRef/)
})

test('transcription exposes DTO and seek callback', () => {
  const source = read('transcription')
  assert.match(source, /startSecond: number; endSecond: number; text: string/)
  assert.match(source, /onSeek\?: \(time: number\) => void/)
})

test('voice selector maps visuals without leaking value to DOM', () => {
  const source = read('voice-selector')
  assert.match(source, /({ className, value, children, \.\.\.props })/)
  assert.match(source, /MarsIcon|VenusIcon|CircleSmallIcon/)
  assert.match(source, /american: "🇺🇸"/)
  assert.match(source, /onOpenChange\?\.\(next, event as VoiceSelectorChangeDetails\)/)
  assert.match(source, /context\.setValue\(selected\)/)
  assert.match(source, /event\.stopPropagation\(\)/)
  assert.match(source, /onPlay\?\.\(\)/)
})

test('audio surfaces have root and dedicated subpath exports', () => {
  const index = readFile('src/index.ts')
  const pkg = readFile('package.json')
  for (const name of ['audio-player', 'transcription', 'voice-selector']) {
    assert.match(index, new RegExp(`from ['"]\\./${name}['"]`))
    assert.match(pkg, new RegExp(`\\"\\./${name}\\"`))
  }
})

test('provenance records fixed upstream source and audio adaptations', () => {
  const sources = readFile('SOURCES.md')
  const provenance = readFile('src/provenance.ts')
  for (const source of [sources, provenance]) {
    assert.match(source, /6a9d5b1822ffb10bba4bd97175f01edd7d8651cd/)
    assert.match(source, /Apache-2\.0/)
  }
  assert.match(sources, /Voice Selector.*shared CommandItem/)
  assert.match(sources, /Audio Player.*media context/)
})
