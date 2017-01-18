import { describe, it } from 'mocha'
import assert from 'assert'

import * as observe from '../src/combinator/observe'
import { iterate } from '../src/source/iterate'
import { take } from '../src/combinator/slice'
import { just as streamOf } from '../src/source/core'
import * as sinon from 'sinon'

const sentinel = { value: 'sentinel' }

describe('observe', function () {
  it('should call callback and return a promise', function () {
    const spy = sinon.spy()

    return observe.observe(spy, streamOf(sentinel))
      .then(function () {
        assert.ok(spy.calledWith(sentinel))
      })
  })

  it('should call callback with expected values until end', function () {
    const n = 5
    const s = take(n, iterate(function (x) {
      return x + 1
    }, 0))

    let y = 0
    const spy = sinon.spy(function (x) {
      assert.strictEqual(x, y++)
    })

    return observe.observe(spy, s)
      .then(function () {
        assert.strictEqual(y, n)
      })
  })
})

describe('drain', function () {
  it('should drain all events', function () {
    let n = 5
    const s = take(n, iterate(function (x) {
      n -= 1
      return x + 1
    }, 0))

    n -= 1 // The initial value is emitted without calling the iterator function

    return observe.drain(s)
      .then(function () {
        assert.strictEqual(n, 0)
      })
  })
})
