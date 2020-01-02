import { describe, it } from 'mocha'
import { is, fail, eq } from '@briancavalier/assert'

import { continueWith } from '../../src/combinator/continueWith'
import { drain } from '../helper/observe'
import { now } from '../../src/source/now'
import { collectEventsFor, Event } from '../helper/testEnv'

describe('continueWith', () => {
  it('when f throws, should propagate error', () => {
    const error = new Error()
    const s = continueWith(() => { throw error }, now(0))
    return drain(s).then(fail, is(error))
  })

  it('should allow union type', () => {
    const s = continueWith(() => now('456'), now(123))
    return collectEventsFor(1, s).then(eq([
      { time: 0, value: 123 },
      { time: 0, value: '456' }
    ] as Event<string | number>[]))
  })
})
