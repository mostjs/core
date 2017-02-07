import { spec, expect } from 'buster'
const { describe, it } = spec
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

var sentinel = { value: 'sentinel' }

function identity (x) {
  return x
}

describe('concatMap', function () {
  it('should satisfy associativity', function () {
    // m.concatMap(f).concatMap(g) ~= m.concatMap(function(x) { return f(x).concatMap(g); })
    function f (x) { return streamOf(x + 'f') }
    function g (x) { return streamOf(x + 'g') }

    var m = streamOf('m')

    return assertSame(
      concatMap.concatMap(function (x) { return concatMap.concatMap(g, f(x)) }, m),
      concatMap.concatMap(g, concatMap.concatMap(f, m))
    )
  })

  it('should concatenate', function () {
    var s1 = [{ time: 2, value: 2 }, { time: 3, value: 3 }]
    var s2 = [{ time: 1, value: 1 }]
    var s3 = [{ time: 0, value: 0 }]
    var s = concatMap.concatMap(atTimes, fromArray([s1, s2, s3]))

    return collectEvents(s, ticks(5))
      .then(function (events) {
        expect(events).toEqual([
          { time: 2, value: 2 },
          { time: 3, value: 3 },
          { time: 4, value: 1 },
          { time: 4, value: 0 }
        ])
      })
  })

  it('should map lazily', function () {
    var s1 = atTimes([{ time: 0, value: 0 }, { time: 1, value: 1 }])

    var scheduler = ticks(4)
    var s = concatMap.concatMap(function (x) {
      return atTimes([{ time: 2, value: scheduler.now() }])
    }, s1)

    return collectEvents(s, scheduler)
      .then(function (events) {
        expect(events).toEqual([
          { time: 2, value: 0 },
          { time: 4, value: 2 }
        ])
      })
  })

  it('should dispose outer stream', function () {
    var dispose = this.spy()
    var inner = streamOf(sentinel)
    var outer = streamOf(inner)

    var s = concatMap.concatMap(identity, new Stream(new FakeDisposeSource(dispose, outer.source)))

    return drain(s).then(function () {
      expect(dispose).toHaveBeenCalled()
    })
  })

  it('should dispose inner stream', function () {
    var dispose = this.spy()
    var inner = new Stream(new FakeDisposeSource(dispose, streamOf(sentinel).source))

    var s = concatMap.concatMap(identity, streamOf(inner))

    return drain(s).then(function () {
      expect(dispose).toHaveBeenCalled()
    })
  })

  it('should dispose inner stream immediately', function () {
    var s = streamOf(concat(streamOf(1), never()))

    return drain(take(1, concatMap.concatMap(identity, s))).then(function () {
      expect(true).toBe(true)
    })
  })

  it('should dispose all inner streams', function () {
    var values = [1, 2, 3]
    var spies = values.map(function () {
      return this.spy()
    }, this)

    var inners = values.map(function (x, i) {
      return new Stream(new FakeDisposeSource(spies[i], streamOf(x).source))
    })

    var s = concatMap.concatMap(identity, fromArray(inners))

    return drain(s).then(function () {
      spies.forEach(function (spy) {
        expect(spy).toHaveBeenCalledOnce()
      })
    })
  })
})
