import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const css = readFileSync(new URL('../src/styles/reui/style-nova.css', import.meta.url), 'utf8')
const sidebar = readFileSync(new URL('../src/core/sidebar.tsx', import.meta.url), 'utf8')
const rule = (name) => css.match(new RegExp(`\\.${name}\\s*\\{([^}]+)\\}`, 's'))?.[1]

test('sidebar active utilities match the boolean attribute emitted by useRender', () => {
  const nested = sidebar.slice(sidebar.indexOf('function SidebarMenuSubButton'))
  assert.match(nested, /data-active:bg-sidebar-accent/)
  assert.match(nested, /data-active:text-sidebar-accent-foreground/)
  assert.match(nested, /\[&>svg\]:text-current/)
  assert.doesNotMatch(nested, /data-\[active=true\]/)
})

test('translucent material leaves item and trigger interaction colors to their owners', () => {
  const material = rule('cn-menu-translucent')
  assert.ok(material)
  assert.match(material, /bg-popover\/70/)
  assert.match(material, /backdrop-blur/)
  assert.doesNotMatch(material, /slot\$=-item|slot\$=-trigger|variant=destructive/)
  assert.doesNotMatch(css, /cn-menu-translucent-aria/)
})

for (const family of ['dropdown-menu', 'context-menu', 'menubar']) {
  test(`${family} pairs destructive focus background and foreground`, () => {
    const item = rule(`cn-${family}-item`)
    assert.ok(item)
    assert.match(item, /data-\[variant=destructive\]:text-\[color:var\(--menu-destructive-foreground\)\]/)
    assert.match(item, /data-\[variant=destructive\]:focus:bg-destructive\s/)
    assert.match(item, /data-\[variant=destructive\]:focus:text-destructive-foreground/)
    assert.doesNotMatch(item, /data-\[variant=destructive\]:focus:bg-destructive\//)
  })
}
