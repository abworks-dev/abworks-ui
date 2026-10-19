import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const base = new URL('../', import.meta.url)
const read = file => readFileSync(new URL(file, base), 'utf8')
const manifest = JSON.parse(read('package.json'))
function files(directory) {
  return readdirSync(new URL(directory + '/', base), { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(directory + '/' + entry.name) : [directory + '/' + entry.name])
}

test('AI publish contract keeps source exports and ships only built ESM/types and styles', () => {
  assert.equal(manifest.exports['./message'], './src/message.tsx')
  assert.deepEqual(Object.keys(manifest.exports), Object.keys(manifest.publishConfig.exports))
  assert.deepEqual(manifest.files, ['dist'])
  assert.deepEqual(manifest.sideEffects, ['**/*.css'])
  for (const name of ['react', 'react-dom']) assert.equal(manifest.peerDependencies[name], '^19.0.0')
  assert.equal(manifest.peerDependencies.tailwindcss, '^4.0.0')
  for (const [name, version] of Object.entries({ '@types/node': '24.13.3', '@types/json-schema': '7.0.15', 'type-fest': '4.41.0' })) assert.equal(manifest.dependencies[name], version)
  assert.match(read('README.md'), /ESNext\.Disposable/)
  assert.match(read('SOURCES.md'), /retired when corrected upstream manifests/)
  assert.ok(!Object.keys(manifest.dependencies).some(name => name.startsWith('@aboard-nexus/')))
  for (const file of files('src').filter(file => /\.tsx?$/.test(file))) assert.doesNotMatch(read(file), /@aboard-nexus\/|apps\/host/)
})

test('caller-owned presentation shapes remain structurally assignable', () => {
  const ts = createRequire(import.meta.url)('typescript')
  const virtual = fileURLToPath(new URL('src/__compatibility_regression__.ts', base))
  const source = `// Frozen example of a caller-owned message, not a transport/runtime schema.
type CallerPart = { type: 'text'; text: string } | { type: 'tool-call'; toolCallId: string; toolName: string; input: { query: string }; status: 'succeeded' };
type CallerMessage = { id: string; role: 'assistant'; parts: CallerPart[]; workspaceId: string };
import type { RuntimeMessage, MessagePart } from './message-types';
const message: RuntimeMessage = null as unknown as CallerMessage;
const part: MessagePart = null as unknown as CallerPart;
const tool: Extract<MessagePart, {type:'tool-call'}> = null as unknown as Extract<CallerPart, {type:'tool-call'}>;
void message; void part; void tool;`
  const options = { noEmit: true, strict: true, skipLibCheck: true, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler }
  const host = ts.createCompilerHost(options)
  const original = host.getSourceFile.bind(host)
  host.getSourceFile = (name, version, ...rest) => name.replaceAll('\\', '/') === virtual.replaceAll('\\', '/') ? ts.createSourceFile(name, source, version, true) : original(name, version, ...rest)
  const program = ts.createProgram([virtual], options, host)
  assert.deepEqual(ts.getPreEmitDiagnostics(program).map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')), [])
})

test('built AI artifacts retain all entries, client boundaries, imports and upstream notices', { skip: !existsSync(new URL('dist/src/index.js', base)) && 'Build first to verify artifacts' }, () => {
  for (const entry of Object.values(manifest.publishConfig.exports)) {
    for (const target of typeof entry === 'string' ? [entry] : Object.values(entry)) assert.ok(existsSync(new URL(target, base)), target)
  }
  for (const file of files('dist').filter(file => /\.(js|d\.ts)$/.test(file))) {
    const source = read(file)
    assert.doesNotMatch(source, /@aboard-nexus\/|packages\/ui\/src/)
    if (file.endsWith('.js')) {
      const stem = file.replace(/^dist\//, '').replace(/\.js$/, '')
      const original = [stem + '.ts', stem + '.tsx'].find(file => existsSync(new URL(file, base)))
      if (original && /(?:^|\n)["']use client["']/.test(read(original))) assert.match(source, /(?:^|\n)["']use client["']/, file)
    }
    for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*)["'](\.[^"']+)["']/g)) {
      if (match[1].endsWith('.css')) continue
      assert.ok(match[1].endsWith('.js'), `${file}: ${match[1]}`)
      const target = new URL(file.endsWith('.d.ts') ? match[1].replace(/\.js$/, '.d.ts') : match[1], new URL(file, base))
      assert.ok(existsSync(target), target.href)
    }
  }
  for (const file of files('dist').filter(file => file.endsWith('.d.ts'))) {
    assert.doesNotMatch(read(file), /\bimport\s*["'][^"']+\.css["']/, file)
    if (existsSync(new URL(file.replace(/\.d\.ts$/, '.js'), base))) {
      assert.match(read(file), /^\/\/\/ <reference types="node" \/>/, file)
    }
  }
  for (const stylesheet of ['@xyflow/react/dist/style.css', './styles/graph.css']) {
    assert.ok(read('dist/src/canvas.js').includes(`import "${stylesheet}"`), stylesheet)
  }
  assert.equal(read('dist/src/styles/graph.css'), read('src/styles/graph.css'))
  assert.equal(read('dist/src/styles/graph.css.d.ts'), read('src/styles/graph.css.d.ts'))
  assert.equal(read('dist/src/styles/react-flow.d.ts'), read('src/styles/react-flow.d.ts'))
  for (const name of ['LICENSE', 'NOTICE', 'SOURCES.md']) assert.equal(read('dist/' + name), read(name))
  assert.match(read('dist/LICENSE'), /Apache License/)
  assert.match(read('dist/SOURCES.md'), /Copyright \(c\) 2026 AgentbaseAI Inc\./)
})
