import { describe, it } from 'mocha'
import { is } from '@briancavalier/assert'

import { newStream } from '../src/source/newStream'
import { Disposable } from '@most/types'

describe('newStream', () => {
  it('should create new stream from RunStream function', () => {
    const run = (): Disposable => ({ dispose: () => Promise.resolve() })
    const s = newStream(run)

    is(run, s.run)
  })
})
