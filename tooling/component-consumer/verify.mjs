import assert from 'node:assert/strict'
import { access, cp, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const fixture = dirname(fileURLToPath(import.meta.url))
const registry = process.argv[2] === '--registry'
const archive = resolve(process.argv[2] ?? '')
assert.ok(registry || process.argv[2]?.endsWith('.tgz'), 'Usage: node tooling/component-consumer/verify.mjs <ui.tgz> [ai.tgz] | --registry')
const aiArchive = registry ? '0.1.0' : process.argv[3] ? resolve(process.argv[3]) : undefined
const external = await mkdtemp(join(tmpdir(), 'abworks-react-consumer-'))
await cp(fixture, external, { recursive: true, filter: source => !source.includes('node_modules') })
const manifest = JSON.parse(await readFile(join(external, 'package.json'), 'utf8'))
manifest.dependencies['@abworks-dev/ui'] = registry ? '0.1.0' : `file:${archive.replaceAll('\\', '/')}`
if (aiArchive) {
  manifest.dependencies['@abworks-dev/ai-ui'] = registry ? '0.1.0' : `file:${aiArchive.replaceAll('\\', '/')}`
  // Unpublished archive checks map AI's UI dependency to that same archive.
  // Registry checks deliberately use no overrides, source links or local archives.
  if (!registry) await writeFile(join(external, 'pnpm-workspace.yaml'), `packages: []\noverrides:\n  '@abworks-dev/ui': ${JSON.stringify(manifest.dependencies['@abworks-dev/ui'])}\n`)
  await writeFile(join(external, 'main.tsx'), await readFile(join(external, 'main.tsx'), 'utf8') + "\nimport './ai-main.js'\n")
  await writeFile(join(external, 'styles.css'), await readFile(join(external, 'styles.css'), 'utf8') + "\n@import '@abworks-dev/ai-ui/styles';\n")
}
await writeFile(join(external, 'package.json'), JSON.stringify(manifest, null, 2))
console.log(`External consumer: ${external}`)
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', env: process.env, shell: process.platform === 'win32' && command === 'pnpm' })
  if (result.error) throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
}
run('pnpm', ['install', '--ignore-scripts'], external)
run('pnpm', ['run', 'build'], external)
run('pnpm', ['exec', 'tsc', '--noEmit', '--module', 'NodeNext', '--moduleResolution', 'NodeNext'], external)
const installed = JSON.parse(await readFile(join(external, 'node_modules/@abworks-dev/ui/package.json'), 'utf8'))
assert.ok(!JSON.stringify(installed).includes('workspace:'), 'No workspace dependency in installed UI')
assert.ok(!Object.keys(installed.dependencies ?? {}).some(name => name.startsWith('@aboard-nexus/')))
assert.ok(!installed.dependencies?.['@abworks-dev/ai-ui'], 'Ordinary UI consumer must not require AI UI')
for (const entry of Object.values(installed.exports)) {
  for (const target of typeof entry === 'string' ? [entry] : Object.values(entry)) {
    assert.ok(target.startsWith('./dist/'), `Archive export must use dist: ${target}`)
    assert.ok(!/\.tsx?$/.test(target) || target.endsWith('.d.ts'), `Archive must not export source: ${target}`)
    await access(join(external, 'node_modules/@abworks-dev/ui', target))
  }
}
if (aiArchive) {
  const ai = JSON.parse(await readFile(join(external, 'node_modules/@abworks-dev/ai-ui/package.json'), 'utf8'))
  assert.ok(!JSON.stringify(ai).includes('workspace:'), 'No workspace reference in installed AI UI')
  assert.ok(!JSON.stringify(ai).includes('@aboard-nexus/'), 'No Nexus reference in installed AI UI')
  for (const entry of Object.values(ai.exports)) {
    for (const target of typeof entry === 'string' ? [entry] : Object.values(entry)) {
      assert.ok(target.startsWith('./dist/'), `AI archive export must use dist: ${target}`)
      await access(join(external, 'node_modules/@abworks-dev/ai-ui', target))
    }
  }
}
run(process.execPath, [join(fixture, 'verify-browser.mjs'), external, ...(aiArchive ? ['--ai'] : [])], external)
console.log(`PASS production consumer retained at ${external}`)
