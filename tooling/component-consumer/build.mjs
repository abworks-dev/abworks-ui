import { build } from 'esbuild'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

await mkdir('dist', { recursive: true })
await build({ entryPoints: ['main.tsx'], bundle: true, minify: true, format: 'esm', platform: 'browser', outfile: 'dist/app.js', define: { 'process.env.NODE_ENV': '"production"' } })
const css = await postcss([tailwind()]).process(await readFile('styles.css', 'utf8'), { from: 'styles.css', to: 'dist/app.css' })
await writeFile('dist/app.css', css.css)
await writeFile('dist/index.html', '<!doctype html><html lang="en" class="style-nova abworks-theme"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"><title>ABWorks external consumer</title></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>')
