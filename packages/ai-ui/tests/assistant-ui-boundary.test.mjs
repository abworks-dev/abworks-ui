import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('assistant-ui ports retain independent exports and caller-owned authority', () => {
  const manifest = JSON.parse(read('package.json'))
  const index = read('src/index.ts')
  for (const [file, name] of [['memory-chips', 'MemoryChips'], ['artifact-card', 'ArtifactCard']]) {
    assert.equal(manifest.exports[`./${file}`], `./src/${file}.tsx`)
    assert.match(index, new RegExp(`export \\{ ${name} \\}`))
    const source = read(`src/${file}.tsx`)
    assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|navigator\.clipboard|node:fs|@radix/)
    assert.match(source, /b6444661cf03cae6c5e10baba1e12c9e010b8ea0/)
  }
  assert.match(index, /from "\.\/artifact"/)
  const provenance = read('SOURCES.md')
  assert.match(provenance, /Assistant UI Source Ports/)
  assert.match(provenance, /Copyright \(c\) 2026 AgentbaseAI Inc\./)
})

test('assistant-ui ports keep motion preference and caller ARIA safeguards', () => {
  assert.match(read('src/memory-chips.tsx'), /motion-safe:animate-in/)
  assert.match(read('src/artifact-card.tsx'), /aria-disabled=\{props\["aria-disabled"\]\}/)
  assert.match(read('src/styles/index.css'), /@media \(prefers-reduced-motion: no-preference\)/)
})
