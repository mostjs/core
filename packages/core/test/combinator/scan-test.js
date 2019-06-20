import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { spy } from 'sinon'

import { scan } from '../../src/combinator/scan'

import { runEffects } from '../../src/runEffects'
import { atTime, makeEventsFromArray, collectEventsFor, ticks } from '../helper/testEnv'
import FakeDisposeStream from '../helper/FakeDisposeStream'

const sentinel = { value: 'sentinel' }

describe('scan', function () {
  it('should yield incremental accumulated values', function () {
    let a = ['a', 'b', 'c', 'd']
    const s = scan((s, x) => s + x, '', makeEventsFromArray(1, a))

    const expected = [
      { time: 0, value: '' },
      { time: 0, value: 'a' },
      { time: 1, value: 'ab' },
      { time: 2, value: 'abc' },
      { time: 3, value: 'abcd' }
    ]

    return collectEventsFor(a.length, s)
      .then(eq(expected))
  })

  it('should dispose', function () {
    const dispose = spy()

    const stream = new FakeDisposeStream(dispose, atTime(0, sentinel))
    const s = scan((z, x) => x, 0, stream)

    return runEffects(s, ticks(1))
      .then(() => assert(dispose.calledOnce))
  })
})
