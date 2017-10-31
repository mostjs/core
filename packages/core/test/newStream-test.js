import { describe, it } from 'mocha'
import { is } from '@briancavalier/assert'

import { newStream } from '../src/source/newStream'

describe('newStream', () => {
  it('should create new stream from RunStream function', () => {
    const run = (sink, scheduler) => ({ dispose: () => {} })
    const s = newStream(run)

    is(run, s.run)
  })
})
