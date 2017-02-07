import { spec, expect } from 'buster'
const { describe, it } = spec
import * as limit from '../src/combinator/limit'
import { periodic } from '../src/source/periodic'
import { zip } from '../src/combinator/zip'
import { map } from '../src/combinator/transform'
import { take } from '../src/combinator/slice'
import { fromArray } from '../src/source/fromArray'
import { empty, just as streamOf } from '../src/source/core'
import { default as Map } from '../src/fusion/Map'

import { ticks, atTimes, collectEvents } from './helper/testEnv'
import { assertSame } from './helper/stream-helper'

var sentinel = { value: 'sentinel' }

describe('debounce', function () {
  describe('when events always occur less frequently than debounce period', function () {
    it('should be identity', function () {
      var n = 5
      var period = 2
      var s = take(n, periodic(period, sentinel))

      var debounced = limit.debounce(1, s)

      return collectEvents(debounced, ticks(n * period))
        .then(function (events) {
          expect(events.length).toBe(5)
        })
    })
  })

  describe('when events always occur more frequently than debounce period', function () {
    it('should be empty when source is empty', function () {
      var s = limit.debounce(1, empty())

      return collectEvents(s, ticks(1))
        .then(function (events) {
          expect(events.length).toBe(0)
        })
    })

    it('should be identity when source is singleton', function () {
      var s = limit.debounce(1, streamOf(sentinel))

      return collectEvents(s, ticks(2))
        .then(function (events) {
          expect(events.length).toBe(1)
          expect(events[0].time).toBe(0)
          expect(events[0].value).toBe(sentinel)
        })
    })

    it('should contain last event when source has many', function () {
      var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      var n = a.length
      var expected = a[n - 1]

      var s = take(10, map(function () {
        return a.shift()
      }, periodic(1)))

      var debounced = limit.debounce(n, s)

      return collectEvents(debounced, ticks(n))
        .then(function (events) {
          expect(events).toEqual([{ time: 9, value: expected }])
        })
    })
  })

  it('should allow events that occur less frequently than debounce period', function () {
    var s = atTimes([
      { time: 0, value: 0 },
      { time: 1, value: 0 },
      { time: 2, value: 1 },
      // leave enough time for debounce period
      { time: 5, value: 0 },
      { time: 6, value: 0 },
      { time: 7, value: 2 }
    ])

    return collectEvents(limit.debounce(2, s), ticks(8))
      .then(function (events) {
        expect(events).toEqual([
          { time: 4, value: 1 },
          { time: 7, value: 2 }
        ])
      })
  })
})

describe('throttle', function () {
  describe('fusion', function () {
    it('should use max', function () {
      var s1 = limit.throttle(2, limit.throttle(1, atTimes([])))
      var s2 = limit.throttle(1, limit.throttle(2, atTimes([])))
      expect(s1.source.period).toBe(s2.source.period)
      expect(s1.source.period).toBe(2)
    })

    it('should commute map', function () {
      function id (x) {
        return x
      }
      var s = limit.throttle(1, map(id, fromArray([1, 2, 3, 4])))

      expect(s.source instanceof Map).toBe(true)
      expect(s.source.f).toBe(id)
      expect(s.source.source.period).toBe(1)
    })
  })

  it('should exclude items that are too frequent', function () {
    var s = atTimes([
      { time: 0, value: 0 },
      { time: 1, value: 1 },
      { time: 2, value: 2 },
      { time: 3, value: 3 },
      { time: 4, value: 4 }
    ])
    var throttled = limit.throttle(2, s)

    return collectEvents(throttled, ticks(5))
      .then(function (events) {
        expect(events).toEqual([
          { time: 0, value: 0 },
          { time: 2, value: 2 },
          { time: 4, value: 4 }
        ])
      })
  })

  it('should be identity when period === 0 and all items are simultaneous', function () {
    var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var s = take(10, fromArray(a))
    return assertSame(s, limit.throttle(0, s))
  })

  it('should be identity when throttle period >= input period', function () {
    var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    var p = take(a.length, periodic(1))

    var i1 = 0
    var s1 = map(function () {
      return a[i1++]
    }, p)

    var i2 = 0
    var s2 = limit.throttle(1, map(function () {
      return a[i2++]
    }, p))

    var zipped = zip(Array, s1, s2)

    return collectEvents(zipped, ticks(a.length))
      .then(function (pairs) {
        pairs.forEach(function (pair) {
          expect(pair[0]).toEqual(pair[1])
        })
      })
  })
})
