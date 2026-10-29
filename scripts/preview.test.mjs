import test from 'node:test'
import assert from 'node:assert/strict'
import { encodePreviewPath, isSafePreviewPath } from './preview-path.mjs'
import { redirectTarget } from '../src/data/site-paths.js'

test('preview accepts clean decoded route and asset paths', () => {
  for (const path of ['/', '/compare', '/compare/litellm', '/assets/site.js', '/docs/index.html']) {
    assert.equal(isSafePreviewPath(path), true, path)
  }
})

test('preview rejects control characters and ambiguous redirect paths before writing headers', () => {
  for (const path of [
    'relative/path',
    '//outside.example/',
    '/\\outside.example/',
    '/bad\u0000/',
    '/bad\r\n/',
    '/bad\u007f/',
    decodeURIComponent('/bad%0D%0A/'),
    decodeURIComponent('/%2Foutside.example/'),
    decodeURIComponent('/%5Coutside.example/'),
  ]) {
    assert.equal(isSafePreviewPath(path), false, JSON.stringify(path))
  }
})

test('preview redirect paths encode Unicode and reserved characters without changing slashes', () => {
  assert.equal(encodePreviewPath('/compare/litellm'), '/compare/litellm')
  assert.equal(encodePreviewPath('/café/'), '/caf%C3%A9/')
  assert.equal(encodePreviewPath('/\u2028/'), '/%E2%80%A8/')
  assert.equal(encodePreviewPath('/question?mark/#part/'), '/question%3Fmark/%23part/')
})

test('retired pages keep query strings and resolve to useful current content', () => {
  assert.equal(redirectTarget('/install?from=old#docker'), '/quickstart?from=old#install')
  assert.equal(redirectTarget('/compare/litellm'), '/docs')
  assert.equal(redirectTarget('/community/'), '/docs#scope')
  assert.equal(redirectTarget('/docs'), null)
  assert.equal(redirectTarget('https://example.com/install'), null)
})
