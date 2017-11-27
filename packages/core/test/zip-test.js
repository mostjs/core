import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'

import { zip, zipArray } from '../src/combinator/zip'
import { empty, isCanonicalEmpty } from '../src/source/empty'

import { makeEvents, collectEventsFor } from './helper/testEnv'

describe('zipArray', function () {
  it('given empty array, should return canonical empty', () => {
    const s = zipArray(Array, [])
    assert(isCanonicalEmpty(s))
  })

  it('given one canonical empty stream, should return canonical empty', () => {
    const s = zipArray(Array, [empty()])
    assert(isCanonicalEmpty(s))
  })

  it('given two or more canonical empty streams, should return canonical empty', () => {
    const n = 2 + Math.floor(Math.random() * 10)
    const streams = Array(n).map(empty)
    const s = zipArray(Array, streams)
    assert(isCanonicalEmpty(s))
  })
})

describe('zip', function () {
  it('given two canonical empty streams, should return canonical empty', () => {
    const s = zip(Array, empty(), empty())
    assert(isCanonicalEmpty(s))
  })

  it('should invoke f for each tuple', function () {
    const n = 3
    const s = zip(Array, makeEvents(1, n), makeEvents(2, n))

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

    return collectEventsFor(n, zip(Array, a, b))
      .then(eq([
        { time: 0, value: [0, 0] },
        { time: 1, value: [1, 1] },
        { time: 2, value: [2, 2] }
      ]))
  })
})
