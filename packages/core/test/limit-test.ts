import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'
import { spy } from 'sinon'

import { debounce, throttle, Throttle } from '../src/combinator/limit'
import { zip } from '../src/combinator/zip'
import { startWith } from '../src/combinator/startWith'
import { delay } from '../src/combinator/delay'
import { map } from '../src/combinator/transform'
import { until } from '../src/combinator/timeslice'
import { empty, isCanonicalEmpty } from '../src/source/empty'
import { never } from '../src/source/never'
import { now } from '../src/source/now'
import Map from '../src/fusion/Map'

import { atTimes, collectEventsFor, makeEventsFromArray, makeEvents } from './helper/testEnv'
import { assertSame } from './helper/stream-helper'
import FakeDisposeSource from './helper/FakeDisposeStream'

const sentinel = { value: 'sentinel' }

describe('debounce', function () {
  it('given canonical empty stream, should return canonical empty', () => {
    const s = debounce(Math.floor(Math.random() * 10), empty())
    assert(isCanonicalEmpty(s))
  })

  describe('when events always occur less frequently than debounce period', function () {
    it('should be identity', function () {
      const n = 5
      const period = 2
      const s = makeEvents(period, n)

      const debounced = debounce(1, s)

      return collectEventsFor(n * period, debounced)
        .then(eq([
          { time: 1, value: 0 },
          { time: 3, value: 1 },
          { time: 5, value: 2 },
          { time: 7, value: 3 },
          { time: 8, value: 4 } // stream ends, last event emitted immediately
        ]))
    })
  })

  describe('when events always occur more frequently than debounce period', function () {
    it('should be empty when source is empty', function () {
      const s = debounce(1, empty())
      return collectEventsFor(1, s)
        .then(eq<unknown>([]))
    })

    it('should be identity when source is singleton', function () {
      const s = debounce(1, now(sentinel))
      return collectEventsFor(2, s)
        .then(eq([{ time: 0, value: sentinel }]))
    })

    it('should contain last event when source has many', function () {
      const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      const n = a.length
      const expected = a[n - 1]

      const debounced = debounce(n, makeEventsFromArray(1, a))

      return collectEventsFor(n, debounced)
        .then(eq([{ time: 9, value: expected }]))
    })
  })

  it('should not repeat last event when end is delayed', () => {
    // See https://github.com/cujojs/most/issues/514
    const expected = Math.random()
    const endAtTicks = 5
    const end = delay(endAtTicks, now(null))
    const debounced = debounce(1, until(end, startWith(expected, never())))

    return collectEventsFor(endAtTicks, debounced)
      .then(eq([{ time: 1, value: expected }]))
  })

  it('should allow events that occur less frequently than debounce period', function () {
    const s = atTimes([
      { time: 0, value: 0 },
      { time: 1, value: 0 },
      { time: 2, value: 1 },
      // leave enough time for debounce period
      { time: 5, value: 0 },
      { time: 6, value: 0 },
      { time: 7, value: 2 }
    ])

    const debounced = debounce(2, s)

    return collectEventsFor(8, debounced)
      .then(eq([
        { time: 4, value: 1 },
        { time: 7, value: 2 }
      ]))
  })

  it('should dispose source', () => {
    const dispose = spy()
    const s = new FakeDisposeSource(dispose, now(sentinel))
    const debounced = debounce(1, s)

    return collectEventsFor(1, debounced).then(() =>
      assert(dispose.calledOnce))
  })
})

describe('throttle', function () {
  it('given canonical empty stream, should return canonical empty', () => {
    const s = throttle(Math.floor(Math.random() * 10), empty())
    assert(isCanonicalEmpty(s))
  })

  describe('fusion', function () {
    it('should use max', function () {
      const s1 = throttle(2, throttle(1, atTimes([]))) as Throttle<never>
      const s2 = throttle(1, throttle(2, atTimes([]))) as Throttle<never>
      eq(2, eq(s1.period, s2.period))
    })

    it('should commute map', function () {
      const id = <A>(x: A): A => x
      const s = throttle(1, map(id, now(undefined)))

      assert(s instanceof Map)
      is(id, (s as Map<void, void>).f)
      eq(1, ((s as Map<void, void>).source as Throttle<void>).period)
    })
  })

  it('should exclude items that are too frequent', function () {
    const s = atTimes([
      { time: 0, value: 0 },
      { time: 1, value: 1 },
      { time: 2, value: 2 },
      { time: 3, value: 3 },
      { time: 4, value: 4 }
    ])

    const throttled = throttle(2, s)

    return collectEventsFor(5, throttled)
      .then(eq([
        { time: 0, value: 0 },
        { time: 2, value: 2 },
        { time: 4, value: 4 }
      ]))
  })

  it('should be identity when period === 0 and all items are simultaneous', function () {
    const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const s = makeEventsFromArray(0, a)
    return assertSame(s, throttle(0, s))
  })

  it('should be identity when throttle period >= input period', function () {
    const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    const s1 = makeEventsFromArray(1, a)
    const s2 = throttle(1, makeEventsFromArray(1, a))

    const zipped = zip((...args) => args, s1, s2)

    return collectEventsFor(a.length, zipped)
      .then(pairs => pairs.forEach(pair => eq(pair.value[0], pair.value[1])))
  })
})
