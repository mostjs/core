import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'

import { slice, take, skip, takeWhile, skipWhile } from '../src/combinator/slice'
import { map } from '../src/combinator/transform'
import { default as Map } from '../src/fusion/Map'

import { makeEventsFromArray, collectEventsFor, makeEvents } from './helper/testEnv'

describe('slice', function () {
  describe('fusion', function () {
    it('should narrow when second slice is smaller', function () {
      const s = slice(1, 5, slice(1, 10, makeEvents(1, 1)))
      eq(2, s.min)
      eq(6, s.max)
    })

    it('should narrow when second slice is larger', function () {
      const s = slice(1, 10, slice(1, 5, makeEvents(1, 1)))
      eq(2, s.min)
      eq(5, s.max)
    })

    it('should commute map', function () {
      const id = x => x
      const s = slice(0, 3, map(id, makeEventsFromArray(1, [0, 1, 2, 3])))

      assert(s instanceof Map)
      is(id, s.f)
      return collectEventsFor(3, s)
        .then(eq([
          { time: 0, value: 0 },
          { time: 1, value: 1 },
          { time: 2, value: 2 }
        ]))
    })
  })

  it('should retain only sliced range', function () {
    const a = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    const s = slice(2, a.length - 2, makeEventsFromArray(1, a))
    return collectEventsFor(a.length - 2, s)
      .then(eq([
        { time: 2, value: 2 },
        { time: 3, value: 3 },
        { time: 4, value: 4 },
        { time: 5, value: 5 },
        { time: 6, value: 6 }
      ]))
  })
})

describe('take', function () {
  it('should take first n elements', function () {
    const n = 2
    const s = take(n, makeEvents(1, 10))
    return collectEventsFor(n, s)
      .then(eq([
        { time: 0, value: 0 },
        { time: 1, value: 1 }
      ]))
  })
})

describe('skip', function () {
  it('should skip first n elements', function () {
    const n = 4
    const s = skip(2, makeEvents(1, n))
    return collectEventsFor(n, s)
      .then(eq([
        { time: 2, value: 2 },
        { time: 3, value: 3 }
      ]))
  })
})

describe('takeWhile', function () {
  it('should take elements until condition becomes false', function () {
    const n = 2
    const p = x => x < n
    const s = takeWhile(p, makeEvents(1, 10))
    return collectEventsFor(n, s)
      .then(eq([
        { time: 0, value: 0 },
        { time: 1, value: 1 }
      ]))
  })
})

describe('skipWhile', function () {
  it('should skip elements until condition becomes false', function () {
    const n = 4
    const p = x => x < 2
    const s = skipWhile(p, makeEvents(1, n))
    return collectEventsFor(n, s)
      .then(eq([
        { time: 2, value: 2 },
        { time: 3, value: 3 }
      ]))
  })
})
