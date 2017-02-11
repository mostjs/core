import { describe, it } from 'mocha'
import { assert, eq } from '@briancavalier/assert'
import { spy } from 'sinon'

import Stream from '../../src/Stream'
import { scan } from '../../src/combinator/scan'

import { runEffects } from '../../src/runEffects'
import { atTime, makeEventsFromArray, collectEventsFor, ticks } from '../helper/testEnv'
import FakeDisposeSource from '../helper/FakeDisposeSource'

const sentinel = { value: 'sentinel' }

function endWith (endValue, { source }) {
  return new Stream({
    run: (sink, scheduler) => {
      return source.run({
        end (t, _) {
          sink.end(t, endValue)
        },
        event (t, x) {
          sink.event(t, x)
        },
        error (t, e) {
          sink.error(t, e)
        }
      }, scheduler)
    }
  })
}

describe('scan', function () {
  it('should yield incremental accumulated values', function () {
    let a = ['a', 'b', 'c', 'd']
    const s = scan((s, x) => s + x, '', makeEventsFromArray(1, a))

    return collectEventsFor(a.length, s)
      .then(eq([
        { time: 0, value: '' },
        { time: 0, value: 'a' },
        { time: 1, value: 'ab' },
        { time: 2, value: 'abc' },
        { time: 3, value: 'abcd' }
      ]))
  })

  it('should preserve end value', function () {
    const stream = endWith(sentinel, atTime(0, {}))
    const s = scan((a, x) => x, {}, stream)

    return runEffects(s, ticks(1)).then(eq(sentinel))
  })

  it('should dispose', function () {
    const dispose = spy()

    const stream = new Stream(new FakeDisposeSource(dispose, atTime(0, sentinel).source))
    const s = scan((z, x) => x, 0, stream)

    return runEffects(s, ticks(1))
      .then(() => assert(dispose.calledOnce))
  })
})
