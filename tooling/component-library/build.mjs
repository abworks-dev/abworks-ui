import { createRequire } from 'node:module'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Keep modules (and client directives) intact rather than bundling React boundaries.
const require = createRequire(import.meta.url)
const ts = require('typescript')
export function buildComponentLibrary(packageDirectory) {
  const root = path.resolve(packageDirectory)
  const outDir = path.join(root, 'dist')
  const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile)
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'))
  const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root, {
    noEmit: false, declaration: true, declarationMap: false, sourceMap: false,
    rootDir: root, outDir, allowImportingTsExtensions: false,
  })
  // Workspace source exports stay useful to apps, but declaration builds consume
  // sibling libraries' published types rather than emitting their source trees.
  parsed.options.paths = { ...parsed.options.paths }
  for (const [name, version] of Object.entries(manifest.dependencies ?? {})) {
    if (!version.startsWith('workspace:')) continue
    const siblingRoot = path.join(root, 'node_modules', name)
    const siblingManifest = JSON.parse(readFileSync(path.join(siblingRoot, 'package.json'), 'utf8'))
    for (const [entry, target] of Object.entries(siblingManifest.publishConfig?.exports ?? {})) {
      if (typeof target !== 'object' || !target.types) continue
      const declaration = path.join(siblingRoot, target.types)
      if (!existsSync(declaration)) throw new Error(`Build ${name} before ${manifest.name}: missing ${declaration}`)
      parsed.options.paths[entry === '.' ? name : name + entry.slice(1)] = [declaration]
    }
  }
  const entries = Object.values(manifest.exports).filter((entry) => typeof entry === 'string' && /\.tsx?$/.test(entry)).map((entry) => path.resolve(root, entry))
  const program = ts.createProgram([...new Set([...parsed.fileNames, ...entries])], parsed.options)
  const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)]
  if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => root, getCanonicalFileName: (file) => file, getNewLine: () => '\n',
  }))
  // Node ESM requires explicit extensions and directory indexes, also in d.ts.
  const imports = (declarations = false) => (context) => (source) => {
    const visit = (node, parent) => {
      // Styles affect runtime only. Do not make type consumers resolve bundler
      // assets (notably under NodeNext + noUncheckedSideEffectImports).
      if (declarations && ts.isImportDeclaration(node) && !node.importClause &&
        ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text.endsWith('.css')) return undefined
      if (ts.isStringLiteral(node) && node.text.startsWith('.') && !node.text.endsWith('.css') && parent &&
        ((ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) && parent.moduleSpecifier === node || ts.isLiteralTypeNode(parent) && parent.parent && ts.isImportTypeNode(parent.parent))) {
        const resolved = ts.resolveModuleName(node.text, source.fileName, parsed.options, ts.sys).resolvedModule
        if (resolved && !resolved.isExternalLibraryImport) {
          let relative = path.relative(path.dirname(source.fileName), resolved.resolvedFileName).replaceAll('\\', '/').replace(/\.(tsx?|mts)$/, '.js')
          if (!relative.startsWith('.')) relative = './' + relative
          return context.factory.createStringLiteral(relative)
        }
      }
      return ts.visitEachChild(node, (child) => visit(child, node), context)
    }
    return ts.visitNode(source, (node) => visit(node, undefined))
  }
  // Only clean the package-owned resolved dist directory, after diagnostics succeed.
  rmSync(outDir, { recursive: true, force: true })
  const result = program.emit(undefined, (fileName, text) => {
    // A transitive @types dependency is not auto-loaded from a consumer's typeRoots.
    // Make the package-owned Node type environment explicit at every declaration subpath.
    const nodeTypes = fileName.endsWith('.d.ts') && manifest.dependencies?.['@types/node']
      ? '/// <reference types="node" />\n' : ''
    mkdirSync(path.dirname(fileName), { recursive: true })
    writeFileSync(fileName, nodeTypes + text)
  }, undefined, false, { before: [imports()], afterDeclarations: [imports(true)] })
  if (result.emitSkipped) throw new Error('Component library emit skipped')
  function copyAssets(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const source = path.join(directory, entry.name)
      if (entry.isDirectory()) copyAssets(source)
      else if (entry.name.endsWith('.d.ts') || !/\.(tsx?|mts)$/.test(entry.name)) {
        const target = path.join(outDir, path.relative(root, source))
        mkdirSync(path.dirname(target), { recursive: true })
        cpSync(source, target)
      }
    }
  }
  copyAssets(path.join(root, 'src'))
  for (const name of ['SOURCES.md', 'LICENSE', 'LICENSE.md', 'NOTICE', 'README.md']) {
    if (existsSync(path.join(root, name))) cpSync(path.join(root, name), path.join(outDir, name))
  }
  console.log(`Built ${manifest.name}: preserved ESM modules, declarations, styles and licenses`)
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildComponentLibrary(process.argv[2] ?? process.cwd())
}
