import { describe, it } from 'mocha'
import { eq, assert } from '@briancavalier/assert'

import { until, since, during } from '../src/combinator/timeslice'
import { take } from '../src/combinator/slice'
import { periodic } from '../src/source/periodic'
import { now } from '../src/source/now'
import { never } from '../src/source/never'
import { delay } from '../src/combinator/delay'

import {
  ticks,
  collectEvents,
  collectEventsFor,
  makeEvents
} from './helper/testEnv'
import FakeDisposeStream from './helper/FakeDisposeStream'

import { spy } from 'sinon'

describe('during', function () {
  it('should contain events at or later than min and earlier than max', function () {
    const stream = take(10, periodic(1))
    const timespan = delay(1, now(delay(5, now())))

    const s = during(timespan, stream)
    return collectEventsFor(10, s).then(
      eq([
        { time: 1, value: undefined },
        { time: 2, value: undefined },
        { time: 3, value: undefined },
        { time: 4, value: undefined },
        { time: 5, value: undefined }
      ])
    )
  })

  it('should dispose source stream', function () {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, periodic(1))
    const timespan = delay(1, now(delay(5, now())))

    const s = during(timespan, stream)
    return collectEvents(s, ticks(6)).then(() => assert(dispose.calledOnce))
  })

  it('should dispose signals', function () {
    const dispose = spy()

    const stream = periodic(1)
    const timespan = delay(1, now(delay(5, now())))
    const dt = FakeDisposeStream.from(dispose, timespan)

    const s = during(dt, stream)
    return collectEvents(s, ticks(6)).then(events => {
      eq(5, events.length)
      assert(dispose.calledOnce)
    })
  })
})

describe('until', function () {
  it('should only contain events earlier than signal', function () {
    const stream = makeEvents(1, 10)
    const signal = delay(3, now())

    const s = until(signal, stream)
    return collectEventsFor(10, s).then(
      eq([
        { time: 0, value: 0 },
        { time: 1, value: 1 },
        { time: 2, value: 2 },
        { time: 3, value: 3 }
      ])
    )
  })

  it('should dispose source stream', function () {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, periodic(1))
    const signal = delay(3, now())

    const s = until(signal, stream)
    return collectEventsFor(5, s).then(() => assert(dispose.calledOnce))
  })

  it('should end immediately on signal', function () {
    const dispose = spy()
    const stream = FakeDisposeStream.from(dispose, never())
    const signal = now()

    const s = until(signal, stream)
    return collectEventsFor(1, s).then(events => {
      eq([], events)
      assert(dispose.calledOnce)
    })
  })

  it('should dispose signal', function () {
    const dispose = spy()
    const stream = periodic(1)
    const signal = FakeDisposeStream.from(dispose, delay(3, now()))

    const s = until(signal, stream)
    return collectEventsFor(5, s).then(events => {
      eq(
        [
          { time: 0, value: undefined },
          { time: 1, value: undefined },
          { time: 2, value: undefined }
        ],
        events
      )
      assert(dispose.calledOnce)
    })
  })
})

describe('since', function () {
  it('should only contain events at or later than signal', function () {
    const n = 5
    const stream = take(n, periodic(1))
    const signal = delay(3, now())

    const s = since(signal, stream)
    return collectEventsFor(n, s).then(
      eq([{ time: 3, value: undefined }, { time: 4, value: undefined }])
    )
  })

  it('should dispose signal', function () {
    const dispose = spy()
    const stream = take(5, periodic(1))
    const signal = FakeDisposeStream.from(dispose, delay(3, now()))

    const s = since(signal, stream)
    return collectEventsFor(5, s).then(() => assert(dispose.calledOnce))
  })
})
