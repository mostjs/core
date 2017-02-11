import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { spy } from 'sinon'

import { assertSame } from '../helper/stream-helper'

import * as concatMap from '../../src/combinator/concatMap'
import { concat } from '../../src/combinator/build'
import { take } from '../../src/combinator/slice'
import { drain } from '../../src/combinator/observe'
import { just as streamOf, never } from '../../src/source/core'
import { fromArray } from '../../src/source/fromArray'
import { default as Stream } from '../../src/Stream'

import { ticks, atTimes, collectEvents } from '../helper/testEnv'
import FakeDisposeSource from '../helper/FakeDisposeSource'

const sentinel = { value: 'sentinel' }

function identity (x) {
  return x
}

describe('concatMap', function () {
  it('should satisfy associativity', function () {
    // m.concatMap(f).concatMap(g) ~= m.concatMap(function(x) { return f(x).concatMap(g); })
    function f (x) { return streamOf(x + 'f') }
    function g (x) { return streamOf(x + 'g') }

    const m = streamOf('m')

    return assertSame(
      concatMap.concatMap(function (x) { return concatMap.concatMap(g, f(x)) }, m),
      concatMap.concatMap(g, concatMap.concatMap(f, m))
    )
  })

  it('should concatenate', function () {
    const s1 = [{ time: 2, value: 2 }, { time: 3, value: 3 }]
    const s2 = [{ time: 1, value: 1 }]
    const s3 = [{ time: 0, value: 0 }]
    const s = concatMap.concatMap(atTimes, fromArray([s1, s2, s3]))

    return collectEvents(s, ticks(5))
      .then(eq([
          { time: 2, value: 2 },
          { time: 3, value: 3 },
          { time: 4, value: 1 },
          { time: 4, value: 0 }
      ]))
  })

  it('should map lazily', function () {
    const s1 = atTimes([{ time: 0, value: 0 }, { time: 1, value: 1 }])

    const scheduler = ticks(4)
    const s = concatMap.concatMap(function (x) {
      return atTimes([{ time: 2, value: scheduler.now() }])
    }, s1)

    return collectEvents(s, scheduler)
      .then(eq([
          { time: 2, value: 0 },
          { time: 4, value: 2 }
      ]))
  })

  it('should dispose outer stream', function () {
    const dispose = spy()
    const inner = streamOf(sentinel)
    const outer = streamOf(inner)

    const s = concatMap.concatMap(identity, new Stream(new FakeDisposeSource(dispose, outer.source)))

    return drain(s).then(function () {
      assert(dispose.called)
    })
  })

  it('should dispose inner stream', function () {
    const dispose = spy()
    const inner = new Stream(new FakeDisposeSource(dispose, streamOf(sentinel).source))

    const s = concatMap.concatMap(identity, streamOf(inner))

    return drain(s).then(function () {
      assert(dispose.called)
    })
  })

  it('should dispose inner stream immediately', function () {
    const s = streamOf(concat(streamOf(1), never()))

    return drain(take(1, concatMap.concatMap(identity, s)))
  })

  it('should dispose all inner streams', function () {
    const values = [1, 2, 3]
    const spies = values.map(function () {
      return spy()
    })

    const inners = values.map(function (x, i) {
      return new Stream(new FakeDisposeSource(spies[i], streamOf(x).source))
    })

    const s = concatMap.concatMap(identity, fromArray(inners))

    return drain(s).then(function () {
      spies.forEach(function (spy) {
        assert(spy.calledOnce)
      })
    })
  })
})
