import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { test } from 'node:test'

const base = new URL('../', import.meta.url)
const read = (file) => readFileSync(new URL(file, base), 'utf8')
const manifest = JSON.parse(read('package.json'))

test('publish overrides preserve source development and cover every public entry', () => {
  assert.equal(manifest.exports['./core/button'], './src/core/button.tsx')
  assert.deepEqual(Object.keys(manifest.publishConfig.exports), Object.keys(manifest.exports))
  assert.deepEqual(manifest.files, ['dist'])
  assert.deepEqual(manifest.sideEffects, ['**/*.css'])
  assert.equal(manifest.peerDependencies['react-dom'], '^19.0.0')
  assert.equal(manifest.peerDependencies.tailwindcss, '^4.0.0')
  assert.ok(!Object.keys(manifest.dependencies).some((name) => name.startsWith('@aboard')))
  for (const entry of Object.values(manifest.publishConfig.exports)) {
    for (const target of typeof entry === 'string' ? [entry] : Object.values(entry)) {
      assert.ok(target.startsWith('./dist/'), target)
      assert.ok(!/\.tsx?$/.test(target) || target.endsWith('.d.ts'), target)
    }
  }
})

test('standalone theme is opt-in and provides scoped light/dark tokens', () => {
  assert.doesNotMatch(read('src/styles/index.css'), /default\.css|abworks-theme/)
  const css = read('src/styles/default.css')
  for (const imported of ['tailwindcss', 'tw-animate-css', 'shadcn/tailwind.css', './index.css']) assert.ok(css.includes(`@import '${imported}'`))
  assert.match(css, /\.abworks-theme\.dark/)
  for (const token of ['background', 'foreground', 'card', 'popover', 'primary', 'destructive', 'border', 'input', 'ring', 'sidebar', 'chart-5']) assert.ok(css.includes(`--${token}:`))
})

test('built distribution preserves directives, resolvable imports, styles and licenses', { skip: !existsSync(new URL('dist/src/index.js', base)) && 'Run build to verify emitted artifacts' }, () => {
  for (const entry of Object.values(manifest.publishConfig.exports)) {
    for (const target of typeof entry === 'string' ? [entry] : Object.values(entry)) assert.ok(existsSync(new URL(target, base)), target)
  }
  assert.match(read('dist/src/core/dialog.js'), /^["']use client["']/)
  assert.match(read('dist/src/index.js'), /from ["']\.\/data-table\/index\.js["']/)
  assert.match(read('dist/src/index.d.ts'), /from ["']\.\/core\/button\.js["']/)
  assert.equal(read('dist/src/styles/reui/LICENSE.md'), read('src/styles/reui/LICENSE.md'))
  assert.equal(read('dist/src/styles/reui/style-nova.css'), read('src/styles/reui/style-nova.css'))
  function check(directory) {
    for (const entry of readdirSync(new URL(directory + '/', base), { withFileTypes: true })) {
      const file = directory + '/' + entry.name
      if (entry.isDirectory()) check(file)
      else if (/\.(js|d\.ts)$/.test(file)) {
        const source = read(file)
        if (file.endsWith('.js') && file.startsWith('dist/src/')) {
          const original = file.replace(/^dist\//, '').replace(/\.js$/, '')
          const sourceFile = [original + '.ts', original + '.tsx'].find((name) => existsSync(new URL(name, base)))
          if (sourceFile && /^\s*["']use client["']/.test(read(sourceFile))) assert.match(source, /^["']use client["']/, file)
        }
        for (const match of source.matchAll(/\bfrom\s+["'](\.[^"']+)["']/g)) {
          assert.ok(match[1].endsWith('.js'), `${file}: ${match[1]}`)
          const resolved = new URL(match[1], new URL(file, base))
          const target = file.endsWith('.d.ts') ? new URL(resolved.href.replace(/\.js$/, '.d.ts')) : resolved
          assert.ok(existsSync(target), `${file}: ${match[1]}`)
        }
      }
    }
  }
  check('dist')
})
