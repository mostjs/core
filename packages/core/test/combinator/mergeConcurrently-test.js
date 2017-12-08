import { describe, it } from 'mocha'
import { assert, fail, is, eq } from '@briancavalier/assert'

import { mergeMapConcurrently, mergeConcurrently } from '../../src/combinator/mergeConcurrently'
import { periodic } from '../../src/source/periodic'
import { take } from '../../src/combinator/slice'
import { constant } from '../../src/combinator/transform'
import { now } from '../../src/source/now'
import { empty, isCanonicalEmpty } from '../../src/source/empty'
import { collectEventsFor, makeEventsFromArray } from '../helper/testEnv'

const sentinel = { value: 'sentinel' }

const periodicConstant = (ms, x) => constant(x, periodic(ms))

describe('mergeConcurrently', () => {
  it('given canonical empty stream, should return canonical empty', () => {
    const s = mergeConcurrently(Math.floor(Math.random() * 10), empty())
    assert(isCanonicalEmpty(s))
  })

  it('should be identity for 1 stream', () => {
    const s = mergeConcurrently(1, now(periodicConstant(1, sentinel)))
    const n = 3

    const expected = [
      { time: 0, value: sentinel },
      { time: 1, value: sentinel },
      { time: 2, value: sentinel }
    ]

    return collectEventsFor(n, take(n, s))
      .then(eq(expected))
  })

  it('should merge all when number of streams <= concurrency', () => {
    const streams = [periodicConstant(1, 1), periodicConstant(1, 2), periodicConstant(1, 3)]
    const s = mergeConcurrently(streams.length, makeEventsFromArray(1, streams))
    const n = 3

    const expected = [
       { time: 0, value: 1 },
       { time: 1, value: 1 },
       { time: 1, value: 2 },
       { time: 2, value: 1 },
       { time: 2, value: 2 },
       { time: 2, value: 3 },
       { time: 3, value: 1 },
       { time: 3, value: 2 },
       { time: 3, value: 3 }
    ]

    return collectEventsFor(n, take(n * streams.length, s))
      .then(eq(expected))
  })

  it('should merge up to concurrency', () => {
    const n = 3
    const m = 2

    const streams = [take(n, periodicConstant(1, 1)), take(n, periodicConstant(1, 2)), take(n, periodicConstant(1, 3))]
    const s = mergeConcurrently(m, makeEventsFromArray(0, streams))

    const expected = [
      { time: 0, value: 1 },
      { time: 0, value: 2 },
      { time: 1, value: 1 },
      { time: 1, value: 2 },
      { time: 2, value: 1 },
      { time: 2, value: 2 },
      { time: 2, value: 3 },
      { time: 3, value: 3 },
      { time: 4, value: 3 }
    ]

    return collectEventsFor(m * n, take(n * streams.length, s))
      .then(eq(expected))
  })
})

describe('mergeMapConcurrently', () => {
  it('given canonical empty stream, should return canonical empty', () => {
    const s = mergeMapConcurrently(_ => _, Math.floor(Math.random() * 10), empty())
    assert(isCanonicalEmpty(s))
  })

  it('when mapping function throws, it should catch and propagate error', () => {
    const error = new Error()
    const s = mergeMapConcurrently(x => { throw error }, 1, now(0))
    return collectEventsFor(1, s).then(fail, is(error))
  })
})
