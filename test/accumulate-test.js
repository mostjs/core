import { spec, referee } from 'buster'
const { describe, it } = spec
const { assert } = referee

import Stream from '../src/Stream'
import { scan } from '../src/combinator/accumulate'
import { observe, drain } from '../src/combinator/observe'

import { fromArray } from '../src/source/fromArray'
import { just } from '../src/source/core'

import FakeDisposeSource from './helper/FakeDisposeSource'

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
  it('should yield combined values', function () {
    let i = 0
    const items = 'abcd'

    const stream = scan((s, x) => s + x, items[0], fromArray(items.slice(1)))

    return observe(s => {
      ++i
      assert.equals(s, items.slice(0, i))
    }, stream)
  })

  it('should preserve end value', function () {
    const expectedEndValue = {}
    const stream = endWith(expectedEndValue, just({}))

    const s = scan((a, x) => x, {}, stream)

    return drain(s).then(endValue =>
      assert.same(endValue, expectedEndValue))
  })

  it('should dispose', function () {
    const dispose = this.spy()

    const stream = new Stream(new FakeDisposeSource(dispose, just(sentinel).source))
    const s = scan(function (z, x) { return x }, 0, stream)

    return drain(s).then(() => assert(dispose.calledOnce))
  })
})
