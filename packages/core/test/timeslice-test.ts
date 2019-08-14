import { describe, it } from 'mocha'
import { eq, assert } from '@briancavalier/assert'

import { until, since, during } from '../src/combinator/timeslice'
import { take } from '../src/combinator/slice'
import { periodic } from '../src/source/periodic'
import { now } from '../src/source/now'
import { never } from '../src/source/never'
import { delay } from '../src/combinator/delay'
import { run } from '../src/run'

import { ticks, collectEvents, collectEventsFor, makeEvents } from './helper/testEnv'
import FakeDisposeStream from './helper/FakeDisposeStream'

import { spy } from 'sinon'
import { Event } from '../src/sink/DeferredSink'

describe('during', () => {
  it('should contain events at or later than min and earlier than max', () => {
    const stream = take(10, periodic(1))
    const timespan = delay(1, now(delay(5, now(undefined))))

    const s = during(timespan, stream)
    return collectEventsFor(10, s)
      .then(eq<Event<void>[]>([
        { time: 1, value: undefined },
        { time: 2, value: undefined },
        { time: 3, value: undefined },
        { time: 4, value: undefined },
        { time: 5, value: undefined }
      ]))
  })

  it('should dispose source stream', () => {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, periodic(1))
    const timespan = delay(1, now(delay(5, now(undefined))))

    const s = during(timespan, stream)
    return collectEvents(s, ticks(6))
      .then(() => assert(dispose.calledOnce))
  })

  it('should dispose signals', () => {
    const dispose = spy()

    const stream = periodic(1)
    const timespan = delay(1, now(delay(5, now(undefined))))
    const dt = FakeDisposeStream.from(dispose, timespan)

    const s = during(dt, stream)
    return collectEvents(s, ticks(6))
      .then(events => {
        eq(5, events.length)
        assert(dispose.calledOnce)
      })
  })
})

describe('until', () => {
  it('should only contain events earlier than signal', () => {
    const stream = makeEvents(1, 10)
    const signal = delay(3, now(undefined))

    const s = until(signal, stream)
    return collectEventsFor(10, s)
      .then(eq([
        { time: 0, value: 0 },
        { time: 1, value: 1 },
        { time: 2, value: 2 },
        { time: 3, value: 3 }
      ]))
  })

  it('should dispose source stream', () => {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, periodic(1))
    const signal = delay(3, now(undefined))

    const s = until(signal, stream)
    return collectEventsFor(5, s)
      .then(() => assert(dispose.calledOnce))
  })

  it('should end immediately on signal', () => {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, never())
    const signal = now(undefined)

    const s = until(signal, stream)
    return collectEventsFor(1, s)
      .then(events => {
        eq([], events)
        assert(dispose.calledOnce)
      })
  })

  it('should dispose signal', () => {
    const dispose = spy()
    const stream = periodic(1)
    const signal = FakeDisposeStream.from(dispose, delay(3, now(undefined)))

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

  it('should dispose with run', (done) => {
    // See https://github.com/mostjs/core/issues/266#issuecomment-459485449
    const stream = periodic(1)
    const signal = FakeDisposeStream.from(done, delay(3, now(undefined)))

    const s = until(signal, stream)
    run({
      event () {},
      error () {},
      end () {}
    }, ticks(5), s)
  })
})

describe('since', () => {
  it('should only contain events at or later than signal', () => {
    const n = 5
    const stream = take(n, periodic(1))
    const signal = delay(3, now(undefined))

    const s = since(signal, stream)
    return collectEventsFor(n, s)
      .then(eq<Event<void>[]>([
        { time: 3, value: undefined },
        { time: 4, value: undefined }
      ]))
  })

  it('should dispose signal', () => {
    const dispose = spy()
    const stream = take(5, periodic(1))
    const signal = FakeDisposeStream.from(dispose, delay(3, now(undefined)))

    const s = since(signal, stream)
    return collectEventsFor(5, s)
      .then(() => assert(dispose.calledOnce))
  })
})
