import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { applyThemeColor } from '../src/theme.js'

const bootstrap = await readFile(new URL('../public/theme-init.js', import.meta.url), 'utf8')
function initialize(saved, systemDark = false, blocked = false) {
  const dataset = {}
  runInNewContext(bootstrap, {
    document: { documentElement: { dataset } },
    localStorage: {
      getItem() {
        if (blocked) throw new Error('Storage blocked')
        return saved
      },
    },
    window: { matchMedia: () => ({ matches: systemDark }) },
  })
  return dataset
}

test('the first visit stays light; explicit choices override the system before paint', () => {
  assert.equal(initialize(null, true).theme, 'light')
  assert.equal(initialize('light', true).theme, 'light')
  assert.equal(initialize('dark', false).theme, 'dark')
  assert.equal(initialize('system', true).theme, 'dark')
  assert.equal(initialize('system', false).theme, 'light')
})

test('invalid or unavailable saved preferences keep a usable light theme', () => {
  assert.equal(initialize('invalid', true).theme, 'light')
  assert.equal(initialize(null, true, true).theme, 'light')
})

test('route metadata updates retain the selected browser chrome color', (t) => {
  let content
  const previous = globalThis.document
  t.after(() => {
    globalThis.document = previous
  })
  globalThis.document = {
    documentElement: { dataset: { theme: 'dark' } },
    querySelector: () => ({
      setAttribute: (_, value) => {
        content = value
      },
    }),
  }
  applyThemeColor()
  assert.equal(content, '#131217')
  globalThis.document.documentElement.dataset.theme = 'light'
  applyThemeColor()
  assert.equal(content, '#fcfcfd')
})
