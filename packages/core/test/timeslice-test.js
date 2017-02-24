import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'

import { until, since, during } from '../src/combinator/timeslice'
import { take } from '../src/combinator/slice'
import { periodic } from '../src/source/periodic'
import { just, never } from '../src/source/core'
import { delay } from '../src/combinator/delay'

import { runEffects } from '../src/runEffects'
import { ticks, collectEvents, collectEventsFor, makeEvents } from './helper/testEnv'
import FakeDisposeStream from './helper/FakeDisposeStream'
import { endWith } from './helper/endWith'

import { spy } from 'sinon'

const sentinel = { value: 'sentinel' }

describe('during', function () {
  it('should contain events at or later than min and earlier than max', function () {
    const stream = take(10, periodic(1))
    const timespan = delay(1, just(delay(5, just())))

    const s = during(timespan, stream)
    return collectEventsFor(10, s)
      .then(eq([
        { time: 1, value: undefined },
        { time: 2, value: undefined },
        { time: 3, value: undefined },
        { time: 4, value: undefined },
        { time: 5, value: undefined }
      ]))
  })

  it('should dispose source stream', function () {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, periodic(1))
    const timespan = delay(1, just(delay(5, just())))

    const s = during(timespan, stream)
    return collectEvents(s, ticks(6))
      .then(() => assert(dispose.calledOnce))
  })

  it('should dispose signals', function () {
    const dispose = spy()

    const stream = periodic(1)
    const timespan = delay(1, just(delay(5, just())))
    const dt = FakeDisposeStream.from(dispose, timespan)

    const s = during(dt, stream)
    return collectEvents(s, ticks(6))
      .then(events => {
        eq(5, events.length)
        assert(dispose.calledOnce)
      })
  })
})

describe('until', function () {
  it('should only contain events earlier than signal', function () {
    const stream = makeEvents(1, 10)
    const signal = delay(3, just())

    const s = until(signal, stream)
    return collectEventsFor(10, s)
      .then(eq([
        { time: 0, value: 0 },
        { time: 1, value: 1 },
        { time: 2, value: 2 },
        { time: 3, value: 3 }
      ]))
  })

  it('should dispose source stream', function () {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, periodic(1))
    const signal = delay(3, just())

    const s = until(signal, stream)
    return collectEventsFor(5, s)
      .then(() => assert(dispose.calledOnce))
  })

  it('should end immediately on signal', function () {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, never())
    const signal = just()

    const s = until(signal, stream)
    return collectEventsFor(1, s)
      .then(events => {
        eq([], events)
        assert(dispose.calledOnce)
      })
  })

  it('should dispose signal', function () {
    const dispose = spy()
    const stream = periodic(1)
    const signal = FakeDisposeStream.from(dispose, delay(3, just()))

    const s = until(signal, stream)
    return collectEventsFor(5, s)
      .then(events => {
        eq([
          { time: 0, value: undefined },
          { time: 1, value: undefined },
          { time: 2, value: undefined }
        ], events)
        assert(dispose.calledOnce)
      })
  })

  it('should use until value as end value', function () {
    const stream = periodic(1)
    const end = delay(3, just(sentinel))

    const s = until(end, stream)
    return runEffects(s, ticks(5))
      .then(is(sentinel))
  })
})

describe('since', function () {
  it('should only contain events at or later than signal', function () {
    const n = 5
    const stream = take(n, periodic(1))
    const signal = delay(3, just())

    const s = since(signal, stream)
    return collectEventsFor(n, s)
      .then(eq([
        { time: 3, value: undefined },
        { time: 4, value: undefined }
      ]))
  })

  it('should dispose signal', function () {
    const dispose = spy()
    const stream = take(5, periodic(1))
    const signal = FakeDisposeStream.from(dispose, delay(3, just()))

    const s = since(signal, stream)
    return collectEventsFor(5, s)
      .then(() => assert(dispose.calledOnce))
  })

  it('should preserve end value', function () {
    const stream = endWith(sentinel, take(3, periodic(1)))
    const start = delay(3, just())

    const s = since(start, stream)
    return runEffects(s, ticks(3))
      .then(is(sentinel))
  })

  it('should preserve end value if end signal occurs before start signal', function () {
    const stream = take(3, periodic(1))
    const start = delay(3, just())
    const end = delay(1, just(sentinel))

    const s = since(start, until(end, stream))
    return runEffects(s, ticks(3))
      .then(is(sentinel))
  })
})
