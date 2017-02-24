import { describe, it } from 'mocha'
import { is, eq, assert } from '@briancavalier/assert'
import { spy } from 'sinon'

import { loop } from '../../src/combinator/loop'
import { throwError } from '../../src/combinator/errors'
import { just } from '../../src/source/core'

import FakeDisposeSource from '../helper/FakeDisposeStream'

import { makeEventsFromArray, collectEventsFor } from '../helper/testEnv'

const sentinel = { value: 'sentinel' }
const other = { value: 'other' }

const toPair = (z, x) => ({ value: x, seed: z })

describe('loop', function () {
  it('should call stepper with seed, value', function () {
    const a = ['a', 'b', 'c', 'd']

    const s = loop((z, x) => toPair(z + 1, x + z), 0, makeEventsFromArray(1, a))

    return collectEventsFor(a.length, s)
      .then(events => {
        eq(a.length, events.length)
        eq([
          { time: 0, value: 'a0' },
          { time: 1, value: 'b1' },
          { time: 2, value: 'c2' },
          { time: 3, value: 'd3' }
        ], events)
      })
  })

  it('should propagate errors', function () {
    const error = new Error()
    const s = loop(toPair, other, throwError(error))

    return collectEventsFor(1, s).catch(is(error))
  })

  it('should dispose', function () {
    const dispose = spy()

    const stream = new FakeDisposeSource(dispose, just(sentinel))
    const s = loop(toPair, 0, stream)

    return collectEventsFor(1, s).then(() => assert(dispose.calledOnce))
  })
})
