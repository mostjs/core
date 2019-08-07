import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'

import { zip, zipArray } from '../src/combinator/zip'
import { now } from '../src/source/now'
import { empty, isCanonicalEmpty } from '../src/source/empty'

import { makeEvents, collectEventsFor } from './helper/testEnv'

const args = <A extends any[]>(...args: A): A => args

describe('zipArray', function () {
  it('given empty array, should return canonical empty', () => {
    const s = zipArray(args, [])
    assert(isCanonicalEmpty(s))
  })

  it('given array containing canonical empty, should return canonical empty', () => {
    const s = zipArray(args, [now(0), empty(), now(1)])
    assert(isCanonicalEmpty(s))
  })

  it('should invoke f for each tuple', function () {
    const n = 3
    const s = zipArray(args, [makeEvents(1, n), makeEvents(2, n), makeEvents(3, n)])

    return collectEventsFor(n * 3, s)
      .then(eq([
        { time: 0, value: [0, 0, 0] },
        { time: 3, value: [1, 1, 1] },
        { time: 6, value: [2, 2, 2] }
      ]))
  })

  it('should end when shortest stream ends', function () {
    const n = 3
    const a = makeEvents(1, n + 1)
    const b = makeEvents(1, n)
    const c = makeEvents(1, n + 1)

    return collectEventsFor(n, zipArray(args, [a, b, c]))
      .then(eq([
        { time: 0, value: [0, 0, 0] },
        { time: 1, value: [1, 1, 1] },
        { time: 2, value: [2, 2, 2] }
      ]))
  })
})

describe('zip', function () {
  it('given one canonical empty stream, should return canonical empty', () => {
    const s = zip(Array, now(0), empty())
    assert(isCanonicalEmpty(s))
  })

  it('given one canonical empty stream, should return canonical empty', () => {
    const s = zip(args, empty(), now(1))
    assert(isCanonicalEmpty(s))
  })

  it('given two canonical empty streams, should return canonical empty', () => {
    const s = zip(args, empty(), empty())
    assert(isCanonicalEmpty(s))
  })

  it('should invoke f for each tuple', function () {
    const n = 3
    const s = zip(args, makeEvents(1, n), makeEvents(2, n))

    return collectEventsFor(n * 2, s)
      .then(eq([
        { time: 0, value: [0, 0] },
        { time: 2, value: [1, 1] },
        { time: 4, value: [2, 2] }
      ]))
  })

  it('should end when shortest stream ends', function () {
    const n = 3
    const a = makeEvents(1, n)
    const b = makeEvents(1, n + 1)

    return collectEventsFor(n, zip(args, a, b))
      .then(eq([
        { time: 0, value: [0, 0] },
        { time: 1, value: [1, 1] },
        { time: 2, value: [2, 2] }
      ]))
  })
})
