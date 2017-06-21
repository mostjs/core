import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { spy } from 'sinon'

import { assertSame } from '../helper/stream-helper'

import * as concatMap from '../../src/combinator/concatMap'
import { concat } from '../../src/combinator/build'
import { take } from '../../src/combinator/slice'
import { drain } from '../helper/observe'
import { now } from '../../src/source/now'
import { never } from '../../src/source/never'

import { ticks, atTimes, makeEventsFromArray, collectEventsFor, collectEvents } from '../helper/testEnv'
import FakeDisposeSource from '../helper/FakeDisposeStream'

const sentinel = { value: 'sentinel' }

const identity = x => x

describe('concatMap', function () {
  it('should satisfy associativity', function () {
    // m.concatMap(f).concatMap(g) ~= m.concatMap(function(x) { return f(x).concatMap(g); })
    const f = x => now(x + 'f')
    const g = x => now(x + 'g')

    const m = now('m')

    return assertSame(
      concatMap.concatMap(x => concatMap.concatMap(g, f(x)), m),
      concatMap.concatMap(g, concatMap.concatMap(f, m))
    )
  })

  it('should concatenate', function () {
    const s1 = [{ time: 2, value: 2 }, { time: 3, value: 3 }]
    const s2 = [{ time: 1, value: 1 }]
    const s3 = [{ time: 0, value: 0 }]
    const s = concatMap.concatMap(atTimes, makeEventsFromArray(1, [s1, s2, s3]))

    const expected = [
      { time: 2, value: 2 },
      { time: 3, value: 3 },
      { time: 4, value: 1 },
      { time: 4, value: 0 }
    ]

    return collectEventsFor(5, s)
      .then(eq(expected))
  })

  it('should map lazily', function () {
    const s1 = atTimes([{ time: 0, value: 0 }, { time: 1, value: 1 }])

    const scheduler = ticks(4)
    const s = concatMap.concatMap(x => atTimes([{ time: 2, value: scheduler.now() }]), s1)

    const expected = [
      { time: 2, value: 0 },
      { time: 4, value: 2 }
    ]

    return collectEvents(s, scheduler)
      .then(eq(expected))
  })

  it('should dispose outer stream', function () {
    const dispose = spy()
    const inner = now(sentinel)
    const outer = now(inner)

    const s = concatMap.concatMap(identity, new FakeDisposeSource(dispose, outer))

    return drain(s).then(() => assert(dispose.called))
  })

  it('should dispose inner stream', function () {
    const dispose = spy()
    const inner = new FakeDisposeSource(dispose, now(sentinel))

    const s = concatMap.concatMap(identity, now(inner))

    return drain(s).then(() => assert(dispose.called))
  })

  it('should dispose inner stream immediately', function () {
    const s = now(concat(now(1), never()))

    return drain(take(1, concatMap.concatMap(identity, s)))
  })

  it('should dispose all inner streams', function () {
    const values = [1, 2, 3]
    const spies = values.map(() => spy())

    const inners = values.map((x, i) => new FakeDisposeSource(spies[i], now(x)))

    const s = concatMap.concatMap(identity, makeEventsFromArray(1, inners))

    return collectEventsFor(3, s).then(() =>
      spies.forEach(spy => assert(spy.calledOnce)))
  })
})
