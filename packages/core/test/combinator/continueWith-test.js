import { describe, it } from 'mocha'
import { eq, rejects } from '@briancavalier/assert'

import { continueWith } from '../../src/combinator/continueWith'
import { drain } from '../../src/combinator/observe'
import { just as just } from '../../src/source/core'

describe('continueWith', () => {
  it('when f throws, should propagate error', () => {
    const error = new Error()
    const s = continueWith(() => { throw error }, just(0))
    return drain(s).then(rejects, eq(error))
  })
})
