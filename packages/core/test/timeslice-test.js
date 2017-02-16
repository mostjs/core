import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { until, since, during } from '../src/combinator/timeslice'
import { take } from '../src/combinator/slice'
import { periodic } from '../src/source/periodic'
import { just, never } from '../src/source/core'
import { delay } from '../src/combinator/delay'
import { default as Stream } from '../src/Stream'

import { runEffects } from '../src/runEffects'
import { ticks, collectEvents, atTime, collectEventsFor, makeEvents } from '../test-buster-old/helper/testEnv'
import FakeDisposeSource from '../test-buster-old/helper/FakeDisposeSource'
import { endWith } from '../test-buster-old/helper/endWith'
import { tap } from '../src/combinator/transform'

const sentinel = { value: 'sentinel' }

describe('during', function () {
  it.only('should contain events at or later than min and earlier than max', function () {
    const stream = makeEvents(1, 10)
    const timespan = atTime(1, atTime(1))

    const s = tap(x => console.log(x), during(timespan, stream))
    return collectEventsFor(1000, s)
      .then(eq([
        { time: 1, value: 1 },
        { time: 2, value: 2 },
        { time: 3, value: 3 },
        { time: 4, value: 4 },
        { time: 5, value: 5 }
      ]))
  })

  it('should dispose source stream', function () {
    var dispose = this.spy()
    var stream = new Stream(FakeDisposeSource.from(dispose, periodic(1)))
    var timespan = delay(1, just(delay(5, just())))

    var s = during(timespan, stream)
    return collectEvents(s, ticks(6))
      .then(function () {
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should dispose signals', function () {
    var dispose = this.spy()

    var stream = periodic(1)
    var timespan = delay(1, just(delay(5, just())))
    var dt = new Stream(FakeDisposeSource.from(dispose, timespan))

    var s = during(dt, stream)
    return collectEvents(s, ticks(6))
      .then(function (events) {
        expect(events.length).toBe(5)
        expect(dispose).toHaveBeenCalledOnce()
      })
  })
})

describe('takeUntil', function () {
  it('should only contain events earlier than signal', function () {
    var stream = periodic(1)
    var signal = delay(3, just())

    var s = until(signal, stream)
    return collectEvents(s, ticks(5))
      .then(function (events) {
        expect(events.length).toBe(3)
      })
  })

  it('should dispose source stream', function () {
    var dispose = this.spy()
    var stream = new Stream(FakeDisposeSource.from(dispose, periodic(1)))
    var signal = delay(3, just())

    var s = until(signal, stream)
    return collectEvents(s, ticks(5))
      .then(function () {
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should end immediately on signal', function () {
    var dispose = this.spy()
    var stream = new Stream(FakeDisposeSource.from(dispose, never()))
    var signal = just()

    var s = until(signal, stream)
    return collectEvents(s, ticks(1))
      .then(function (events) {
        expect(events.length).toBe(0)
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should dispose signal', function () {
    var dispose = this.spy()
    var stream = periodic(1)
    var signal = new Stream(FakeDisposeSource.from(dispose, delay(3, just())))

    var s = until(signal, stream)
    return collectEvents(s, ticks(5))
      .then(function (events) {
        expect(events.length).toBe(3)
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should use takeUntil value as end value', function () {
    var stream = periodic(1)
    var end = delay(3, just(sentinel))

    var s = until(end, stream)
    return runEffects(s, ticks(5))
      .then(function (x) {
        expect(x).toBe(sentinel)
      })
  })
})

describe('skipUntil', function () {
  it('should only contain events at or later than signal', function () {
    var n = 10
    var stream = take(n, periodic(1))
    var signal = delay(3, just())

    var s = since(signal, stream)
    return collectEvents(s, ticks(n))
      .then(function (events) {
        expect(events.length).toBe(7)
      })
  })

  it('should dispose signal', function () {
    var dispose = this.spy()
    var stream = take(10, periodic(1))
    var signal = new Stream(FakeDisposeSource.from(dispose, delay(3, just())))

    var s = since(signal, stream)
    return collectEvents(s, ticks(10))
      .then(function (events) {
        expect(events.length).toBe(7)
        expect(dispose).toHaveBeenCalledOnce()
      })
  })

  it('should preserve end value', function () {
    var stream = endWith(sentinel, take(3, periodic(1)))
    var start = delay(3, just())

    var s = since(start, stream)
    return runEffects(s, ticks(3))
      .then(function (x) {
        expect(x).toBe(sentinel)
      })
  })

  it('should allow end before start signal', function () {
    var stream = take(3, periodic(1))
    var start = delay(3, just())
    var end = delay(1, just(sentinel))

    var s = since(start, until(end, stream))
    return runEffects(s, ticks(3))
      .then(function (x) {
        expect(x).toBe(sentinel)
      })
  })
})
