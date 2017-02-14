import { describe, it } from 'mocha'
import { is, fail } from '@briancavalier/assert'

import { continueWith } from '../../src/combinator/continueWith'
import { drain } from '../../src/combinator/observe'
import { just } from '../../src/source/core'

describe('continueWith', () => {
  it('when f throws, should propagate error', () => {
    const error = new Error()
    const s = continueWith(() => { throw error }, just(0))
    return drain(s).then(fail, is(error))
  })
})
