import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'

import { slice, take, skip, takeWhile, skipWhile, skipAfter, Slice } from '../../../src/combinator/slice' // eslint-disable-line no-unused-vars
import { boundsFrom } from '../../../src/combinator/slice/bounds'
import { map } from '../../../src/combinator/transform'
import { now } from '../../../src/source/now'
import { empty, isCanonicalEmpty } from '../../../src/source/empty'
import Map from '../../../src/fusion/Map'

import { makeEventsFromArray, collectEventsFor, makeEvents } from '../../helper/testEnv'
import { assertSame } from '../../helper/stream-helper'

describe('slice', function () {
  describe('fusion', function () {
    it('should return empty given empty', () => {
      assert(isCanonicalEmpty(slice(0, 1, empty())))
    })

    it('should return empty given zero-length slice', () => {
      const i = Math.floor(Math.random() * 1000)
      assert(isCanonicalEmpty(slice(i, i, now(i))))
    })

    it('should return empty when fusion leads to zero-length slice', () => {
      assert(isCanonicalEmpty(slice(1, 2, slice(1, 2, now('')))))
    })

    it('should narrow when second slice is smaller', function () {
      const s = slice(1, 5, slice(1, 10, now(''))) as Slice<string>
      eq(boundsFrom(2, 6), s.bounds)
    })

    it('should narrow when second slice is larger', function () {
      const s = slice(1, 10, slice(1, 5, now(''))) as Slice<string>
      eq(boundsFrom(2, 5), s.bounds)
    })

    it('should commute map', function () {
      const id = <A>(x: A): A => x
      const s = slice(0, 3, map(id, makeEventsFromArray(1, [0, 1, 2, 3])))

      assert(s instanceof Map)
      is(id, (s as Map<number, number>).f)
      return collectEventsFor(3, s)
        .then(eq([
          { time: 0, value: 0 },
          { time: 1, value: 1 },
          { time: 2, value: 2 }
        ]))
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

    it('given infinite bounds, should be identity', () => {
      const s = makeEvents(1, 3)
      is(s, slice(0, Infinity, s))
    })

    it('should accumulate take(..., skip(...))', () => {
      const s = take(1, skip(1, now(''))) as Slice<string>
      eq(boundsFrom(1, 2), s.bounds)
    })

    it('should accumulate skip(..., take(...))', () => {
      const s = skip(1, take(1, now('')))
      assert(isCanonicalEmpty(s))
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
    it('given canonical empty stream, should return canonical empty', () => {
      const s = takeWhile(Boolean, empty())
      assert(isCanonicalEmpty(s))
    })

    it('should take elements until condition becomes false', function () {
      const n = 2
      const p = (x: number) => x < n
      const s = takeWhile(p, makeEvents(1, 10))
      return collectEventsFor(n, s)
        .then(eq([
          { time: 0, value: 0 },
          { time: 1, value: 1 }
        ]))
    })
  })

  describe('skipWhile', function () {
    it('given canonical empty stream, should return canonical empty', () => {
      const s = skipWhile(Boolean, empty())
      assert(isCanonicalEmpty(s))
    })

    it('should skip elements until condition becomes false', function () {
      const n = 4
      const p = (x: number) => x < 2
      const s = skipWhile(p, makeEvents(1, n))
      return collectEventsFor(n, s)
        .then(eq([
          { time: 2, value: 2 },
          { time: 3, value: 3 }
        ]))
    })
  })

  describe('skipAfter', function () {
    it('given canonical empty stream, should return canonical empty', () => {
      const s = skipAfter(Boolean, empty())
      assert(isCanonicalEmpty(s))
    })

    it('should skip all elements after the first one for which the condition is true', function () {
      const n = 5
      const n2 = n * 2
      const s = skipAfter(x => x === 5, makeEvents(1, n2))

      return collectEventsFor(n2, s)
        .then(eq([
          { time: 0, value: 0 },
          { time: 1, value: 1 },
          { time: 2, value: 2 },
          { time: 3, value: 3 },
          { time: 4, value: 4 },
          { time: 5, value: 5 }
        ]))
    })

    it('should contain all elements when condition is false', function () {
      const s = makeEvents(1, 10)
      return assertSame(s, skipAfter(_ => false, s))
    })
  })
})
