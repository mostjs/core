import { describe, it } from 'mocha'
import { is } from '@briancavalier/assert'

import { default as Stream } from '../src/Stream'

describe('Stream', function () {
  it('should have expected source', function () {
    const source = { run: () => ({ dispose: () => {} }) }
    const s = new Stream(source)
    is(source, s.source)
  })
})
