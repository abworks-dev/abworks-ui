import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const surfaces = ['canvas', 'connection', 'controls', 'edge', 'panel', 'toolbar', 'node']
const commit = '6a9d5b1822ffb10bba4bd97175f01edd7d8651cd'

test('graph ports expose all seven root surfaces and dedicated package subpaths', () => {
  const manifest = JSON.parse(read('package.json'))
  const index = read('src/index.ts')
  assert.equal(manifest.dependencies['@xyflow/react'], '12.10.0')
  for (const name of surfaces) {
    const symbol = name[0].toUpperCase() + name.slice(1)
    assert.equal(manifest.exports[`./${name}`], `./src/${name}.tsx`)
    assert.match(index, new RegExp(name === 'node' ? `Node,` : `export \\{ ${symbol} \\} from "\\./${name}"`))
    assert.match(read(`src/${name}.tsx`), new RegExp(`export const ${symbol}`))
  }
  for (const name of ['Canvas', 'Controls', 'Panel', 'Toolbar']) {
    assert.match(index, new RegExp(`export type \\{ ${name}Props \\}`))
  }
  // Preserve the existing metadata/UI distinction and unrelated compound surface.
  assert.equal(manifest.exports['./sources'], './src/provenance.ts')
  assert.equal(manifest.exports['./sources-ui'], './src/sources.tsx')
  assert.match(index, /QuestionSubmit/)
  assert.match(index, /ArtifactCard/)
})

test('Node preserves the upstream compound API and caller-owned handle visibility', () => {
  const source = read('src/node.tsx')
  assert.match(source, /handles: \{\s+target: boolean\s+source: boolean\s+\}/)
  assert.match(source, /handles\.target && <Handle position=\{Position\.Left\} type="target" \/>/)
  assert.match(source, /handles\.source && <Handle position=\{Position\.Right\} type="source" \/>/)
  for (const symbol of ['Node', 'NodeHeader', 'NodeTitle', 'NodeDescription', 'NodeAction', 'NodeContent', 'NodeFooter']) {
    assert.match(source, new RegExp(`export (const|type) ${symbol}`))
  }
  assert.doesNotMatch(source, /HandleProps\[\]|export \{ Position \}/)
  assert.doesNotMatch(source, /fetch\(|useNodesState|useEdgesState|navigator\./)
})


test('Canvas keeps upstream interaction defaults overridable and graph state caller-owned', () => {
  const source = read('src/canvas.tsx')
  assert.match(source, /export type CanvasProps = ReactFlowProps/)
  for (const pattern of [
    /const deleteKeyCode = \["Backspace", "Delete"\]/,
    /deleteKeyCode=\{deleteKeyCode\}/,
    /\bfitView\b/,
    /panOnDrag=\{false\}/,
    /\bpanOnScroll\b/,
    /selectionOnDrag=\{true\}/,
    /zoomOnDoubleClick=\{false\}/,
  ]) assert.match(source, pattern)
  assert.ok(source.indexOf('{...props}') > source.indexOf('zoomOnDoubleClick={false}'))
  assert.match(source, /<Background bgColor="var\(--color-sidebar\)" \/>/)
  assert.match(source, /\{children\}/)
  assert.doesNotMatch(source, /useNodesState|useEdgesState|useState|onNodesChange=|onEdgesChange=|onConnect=|defaultNodes=|defaultEdges=/)
})

test('graph wrappers retain exact engine primitives, native callback props and override ordering', () => {
  for (const [name, primitive] of [['controls', 'ControlsPrimitive'], ['panel', 'PanelPrimitive'], ['toolbar', 'NodeToolbar']]) {
    const source = read(`src/${name}.tsx`)
    assert.match(source, new RegExp(`ComponentProps<typeof ${primitive}>`))
    assert.match(source, /from "\.\/utils"/)
    assert.match(source, /className=\{cn\(/)
    assert.match(source, /\{\.\.\.props\}/)
    assert.doesNotMatch(source, /onClick=|onZoomIn=|onZoomOut=|onFitView=|onInteractiveChange=/)
  }
  const toolbar = read('src/toolbar.tsx')
  assert.ok(toolbar.indexOf('{...props}') > toolbar.indexOf('position={Position.Bottom}'))
  assert.match(read('src/connection.tsx'), /Connection: ConnectionLineComponent/)
  assert.match(read('src/connection.tsx'), /fromX \+ \(toX - fromX\) \* HALF/)
})

test('Edge preserves compound variants, measured geometry and known upstream limits', () => {
  const source = read('src/edge.tsx')
  assert.match(source, /export const Edge = \{\s+Animated,\s+Temporary,/)
  assert.match(source, /getSimpleBezierPath\(/)
  assert.match(source, /getBezierPath\(/)
  assert.match(source, /useInternalNode\(source\)/)
  assert.match(source, /useInternalNode\(target\)/)
  assert.match(source, /if \(!\(sourceNode && targetNode\)\) \{\s+return null/)
  assert.match(source, /sourcePos = Position\.Right/)
  assert.match(source, /targetPos = Position\.Left/)
  assert.match(source, /return \[0, 0\] as const/)
  assert.match(source, /positionAbsolute\.x \+ handle\.x \+ offsetX/)
  assert.match(source, /positionAbsolute\.y \+ handle\.y \+ offsetY/)
  assert.match(source, /strokeDasharray: "5, 5"/)
  assert.match(source, /markerEnd=\{markerEnd\} path=\{edgePath\} style=\{style\}/)
  assert.match(source, /<animateMotion dur="2s" path=\{edgePath\} repeatCount="indefinite"/)
})

test('graph styling consumes ABWorks tokens and preserves required engine CSS', () => {
  const canvas = read('src/canvas.tsx')
  assert.match(canvas, /cn\("aui-graph", className\)/)
  assert.ok(canvas.indexOf('import "@xyflow/react/dist/style.css"') < canvas.indexOf('import "./styles/graph.css"'))
  assert.match(read('src/styles/react-flow.d.ts'), /declare module "@xyflow\/react\/dist\/style\.css";/)
  assert.doesNotMatch(read('src/styles/react-flow.d.ts'), /declare module "\*\.css"/)
  assert.match(read('src/styles/graph.css.d.ts'), /export \{\};/)
  const styles = read('src/styles/graph.css')
  assert.match(styles, /\.react-flow\.aui-graph/)
  for (const variable of ['node-background-color', 'node-color', 'edge-stroke', 'handle-background-color', 'selection-border', 'controls-button-color', 'edge-label-color']) {
    assert.match(styles, new RegExp(`--xy-${variable}: .*var\\(--color-`))
  }
  assert.match(read('src/connection.tsx'), /fill="var\(--color-background\)"/)
  assert.match(read('src/edge.tsx'), /fill="var\(--color-primary\)"/)
  for (const name of surfaces) assert.doesNotMatch(read(`src/${name}.tsx`), /#[0-9a-fA-F]{3,8}\b|@repo\/shadcn-ui|@radix/)
})

test('graph source provenance is fixed and privileged capabilities remain outside the package', () => {
  const provenance = read('SOURCES.md')
  for (const name of surfaces) {
    const source = read(`src/${name}.tsx`)
    assert.match(source, /"use client"/)
    assert.match(source, new RegExp(commit))
    assert.match(source, /Copyright 2023 Vercel, Inc\. Licensed under Apache-2\.0/)
    assert.match(source, /from "@xyflow\/react"/)
    assert.doesNotMatch(source, /fetch\(|XMLHttpRequest|localStorage|navigator\.clipboard|["']node:|@aboard-nexus\/host|useNodesState|useEdgesState/)
    assert.ok(provenance.includes(`https://github.com/vercel/ai-elements/blob/${commit}/packages/elements/src/${name}.tsx`))
  }
  assert.match(provenance, /callers own nodes, edges, graph updates/)
  assert.match(provenance, /Known upstream limits/)
  assert.doesNotMatch(provenance, /No Node\/Handle\/MiniMap port is included/)
})
