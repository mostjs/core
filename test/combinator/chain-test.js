import { spec, referee } from 'buster'
const { describe, it } = spec
const { assert } = referee

import { chain, join } from '../../src/combinator/chain'
import { delay } from '../../src/combinator/delay'
import { concat } from '../../src/combinator/build'
import { take } from '../../src/combinator/slice'
import { drain } from '../../src/combinator/observe'
import { of as just, never } from '../../src/source/core'
import { fromArray } from '../../src/source/fromArray'
import Stream from '../../src/Stream'

import { assertSame } from '../helper/stream-helper'
import * as te from './../helper/testEnv'
import FakeDisposeSource from './../helper/FakeDisposeSource'

const sentinel = { value: 'sentinel' }

describe('chain', function () {
  it('should satisfy associativity', function () {
    // m.flatMap(f).flatMap(g) ~= m.flatMap(function(x) { return f(x).flatMap(g); })
    function f (x) { return just(x + 'f') }
    function g (x) { return just(x + 'g') }

    const m = just('m')

    return assertSame(
      chain(function (x) { return chain(g, f(x)) }, m),
      chain(g, chain(f, m))
    )
  })

  it('should preserve time order', function () {
    const s = chain(x => delay(x, just(x)), fromArray([2, 1]))

    return te.collectEvents(s, te.ticks(3))
      .then(events => {
        assert.same(2, events.length)

        assert.same(1, events[0].time)
        assert.same(1, events[0].value)

        assert.same(2, events[1].time)
        assert.same(2, events[1].value)
      })
  })
})

describe('join', function () {
  it('should merge items from all inner streams', function () {
    const a = [1, 2, 3]
    const b = [4, 5, 6]
    const streamsToMerge = fromArray([delay(1, fromArray(a)), fromArray(b)])

    const s = join(streamsToMerge)

    return te.collectEvents(s, te.ticks(2))
      .then(events => {
        const result = events.map(({ value }) => value)
        // Include all items
        assert.equals(a.concat(b).sort(), result.sort())

        // Relative order of items in each stream must be preserved
        assert(result.indexOf(1) < result.indexOf(2))
        assert(result.indexOf(2) < result.indexOf(3))
        assert(result.indexOf(4) < result.indexOf(5))
        assert(result.indexOf(5) < result.indexOf(6))
      })
  })

  it('should dispose outer stream', function () {
    const dispose = this.spy()
    const inner = just(sentinel)
    const outer = just(inner)

    const s = join(new Stream(new FakeDisposeSource(dispose, outer.source)))

    return drain(s).then(() => assert(dispose.calledOnce))
  })

  it('should dispose inner stream', function () {
    const dispose = this.spy()
    const inner = new Stream(new FakeDisposeSource(dispose, just(sentinel).source))

    const s = join(just(inner))

    return drain(s).then(() => assert(dispose.calledOnce))
  })

  it('should dispose inner stream immediately', function () {
    const s = just(concat(just(1), never()))
    return drain(take(1, join(s))).then(() => assert(true))
  })

  it('should dispose all inner streams', function () {
    const values = [1, 2, 3]
    const spies = values.map(() => this.spy())

    const inners = values.map((x, i) => new Stream(new FakeDisposeSource(spies[i], just(x).source)))

    const s = join(fromArray(inners))

    return drain(s).then(() =>
      spies.forEach(spy => assert(spy.calledOnce)))
  })
})
