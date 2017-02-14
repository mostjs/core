import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { spy } from 'sinon'

import { chain, join } from '../../src/combinator/chain'
import { delay } from '../../src/combinator/delay'
import { concat } from '../../src/combinator/build'
import { take } from '../../src/combinator/slice'
import { drain } from '../../src/combinator/observe'
import { just, never } from '../../src/source/core'
import { fromArray } from '../../src/source/fromArray'
import Stream from '../../src/Stream'

import { assertSame } from '../helper/stream-helper'
import { collectEventsFor } from '../helper/testEnv'
import FakeDisposeSource from './../helper/FakeDisposeSource'

const sentinel = { value: 'sentinel' }

describe('chain', function () {
  it('should satisfy associativity', function () {
    // m.chain(f).chain(g) ~= m.chain(function(x) { return f(x).chain(g); })
    const f = x => just(x + 'f')
    const g = x => just(x + 'g')

    const m = just('m')

    return assertSame(
      chain(x => chain(g, f(x)), m),
      chain(g, chain(f, m))
    )
  })

  it('should preserve time order', function () {
    const s = chain(x => delay(x, just(x)), fromArray([2, 1]))
    const expected = [ { time: 1, value: 1 }, { time: 2, value: 2 } ]

    return collectEventsFor(3, s)
      .then(eq(expected))
  })
})

describe('join', function () {
  it('should merge items from all inner streams', function () {
    const a = [1, 2, 3]
    const b = [4, 5, 6]
    const streamsToMerge = fromArray([delay(1, fromArray(a)), fromArray(b)])

    const s = join(streamsToMerge)

    return collectEventsFor(2, s)
      .then(events => {
        const result = events.map(({ value }) => value)
        // Include all items
        eq(a.concat(b).sort(), result.sort())

        // Relative order of items in each stream must be preserved
        assert(result.indexOf(1) < result.indexOf(2))
        assert(result.indexOf(2) < result.indexOf(3))
        assert(result.indexOf(4) < result.indexOf(5))
        assert(result.indexOf(5) < result.indexOf(6))
      })
  })

  it('should dispose outer stream', function () {
    const dispose = spy()
    const inner = just(sentinel)
    const outer = just(inner)

    const s = join(new Stream(new FakeDisposeSource(dispose, outer.source)))

    return drain(s).then(() => assert(dispose.calledOnce))
  })

  it('should dispose inner stream', function () {
    const dispose = spy()
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
    const spies = values.map(() => spy())

    const inners = values.map((x, i) => new Stream(new FakeDisposeSource(spies[i], just(x).source)))

    const s = join(fromArray(inners))

    return drain(s).then(() =>
      spies.forEach(spy => assert(spy.calledOnce)))
  })
})
