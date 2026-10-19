import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createRequire } from 'node:module'

// Browser tooling belongs to the harness, not the installed consumer graph.
const require = createRequire(new URL('../../package.json', import.meta.url))
const { chromium, expect } = require('@playwright/test')
const root = process.argv[2]
assert.ok(root, 'Pass the external consumer directory')
const server = createServer(async (req, res) => {
  const file = { '/': 'index.html', '/app.js': 'app.js', '/app.css': 'app.css' }[req.url]
  if (!file) { res.writeHead(404).end(); return }
  try {
    res.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html')
    res.end(await readFile(join(root, 'dist', file)))
  } catch { res.writeHead(500).end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.getByRole('button', { name: 'Count 0', exact: true }).click()
  await page.getByRole('button', { name: 'Count 1', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  assert.equal(await page.getByLabel('Name', { exact: true }).evaluate(el => el.validity.valueMissing), true)
  assert.equal(await page.getByLabel('Saved name').textContent(), '')
  await page.getByLabel('Name', { exact: true }).fill('Personal website')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  assert.equal(await page.getByLabel('Saved name').textContent(), 'Personal website')
  const light = await page.getByRole('button', { name: 'Count 1', exact: true }).evaluate(el => getComputedStyle(el).backgroundColor)
  assert.notEqual(light, 'rgba(0, 0, 0, 0)', 'Button must have compiled styling')
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Archive dialog' })
  await dialog.waitFor()
  assert.equal(await dialog.evaluate(el => document.getElementById('root').contains(el)), false, 'Dialog must use a real Portal')
  assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true, 'Dialog receives focus')
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Tab')
    // Base UI redirects focus through a transient guard outside the popup.
    await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement)), {
      message: 'Dialog traps keyboard focus after its guard redirects',
    }).toBe(true)
  }
  const dialogLight = await dialog.evaluate(el => getComputedStyle(el).backgroundColor)
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'hidden' })
  assert.equal(await page.getByRole('button', { name: 'Open dialog', exact: true }).evaluate(el => el === document.activeElement), true)
  await page.getByRole('button', { name: 'Help', exact: true }).hover()
  await page.getByRole('tooltip').waitFor()
  assert.match(await page.getByRole('tooltip').textContent(), /Archive tooltip/)
  await page.getByRole('button', { name: 'Toggle dark' }).click()
  const dark = await page.getByRole('button', { name: 'Count 1', exact: true }).evaluate(el => getComputedStyle(el).backgroundColor)
  assert.notEqual(dark, light, 'Dark mode changes semantic Button colors')
  await page.getByRole('button', { name: 'Open dialog', exact: true }).click()
  await dialog.waitFor()
  assert.notEqual(await dialog.evaluate(el => getComputedStyle(el).backgroundColor), dialogLight, 'Portal inherits dark theme')
  // Modal accessibility isolation hides other page regions until it closes.
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'hidden' })
  if (process.argv.includes('--ai')) {
    await page.getByRole('region', { name: 'Optional AI example' }).getByText('Optional AI archive consumer').waitFor()
  }
  assert.deepEqual(errors, [])
  console.log('PASS external archive: Button, form, Dialog Portal/focus/Escape, Tooltip, dark theme, production bundle')
} finally {
  await browser?.close()
  await new Promise(resolve => server.close(resolve))
}
