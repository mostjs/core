import { spec, referee } from 'buster'
const { describe, it } = spec
const { fail, assert } = referee

import { mergeMapConcurrently, mergeConcurrently } from '../../src/combinator/mergeConcurrently'
import { periodic } from '../../src/source/periodic'
import { take } from '../../src/combinator/slice'
import { constant } from '../../src/combinator/transform'
import { drain } from '../../src/combinator/observe'
import { just as just } from '../../src/source/core'
import { fromArray } from '../../src/source/fromArray'
import te from '../helper/testEnv'

const sentinel = { value: 'sentinel' }

const periodicConstant = (ms, x) => constant(x, periodic(ms))

describe('mergeConcurrently', () => {
  it('should be identity for 1 stream', () => {
    const s = mergeConcurrently(1, just(periodicConstant(1, sentinel)))
    const n = 3

    return te.collectEvents(take(n, s), te.ticks(n))
      .then(events => {
        assert.equals(events, [
          { time: 0, value: sentinel },
          { time: 1, value: sentinel },
          { time: 2, value: sentinel }
        ])
      })
  })

  it('should merge all when number of streams <= concurrency', () => {
    const streams = [periodicConstant(1, 1), periodicConstant(1, 2), periodicConstant(1, 3)]
    const s = mergeConcurrently(streams.length, fromArray(streams))
    const n = 3

    return te.collectEvents(take(n * streams.length, s), te.ticks(n))
      .then(events => {
        assert.equals(events, [
          { time: 0, value: 1 },
          { time: 0, value: 2 },
          { time: 0, value: 3 },
          { time: 1, value: 1 },
          { time: 1, value: 2 },
          { time: 1, value: 3 },
          { time: 2, value: 1 },
          { time: 2, value: 2 },
          { time: 2, value: 3 }
        ])
      })
  })

  it('should merge up to concurrency', () => {
    const n = 3
    const m = 2

    const streams = [take(n, periodicConstant(1, 1)), take(n, periodicConstant(1, 2)), take(n, periodicConstant(1, 3))]
    const s = mergeConcurrently(m, fromArray(streams))

    return te.collectEvents(take(n * streams.length, s), te.ticks(m * n))
      .then(events => {
        assert.equals(events, [
          { time: 0, value: 1 },
          { time: 0, value: 2 },
          { time: 1, value: 1 },
          { time: 1, value: 2 },
          { time: 2, value: 1 },
          { time: 2, value: 2 },
          { time: 2, value: 3 },
          { time: 3, value: 3 },
          { time: 4, value: 3 }
        ])
      })
  })
})

describe('mergeMapConcurrently', () => {
  it('when mapping function throws, it should catch and propagate error', () => {
    const error = new Error()
    const s = mergeMapConcurrently(x => { throw error }, 1, just(0))
    return drain(s).then(fail, e => assert.same(error, e))
  })
})
