import { spec, expect } from 'buster'
const { describe, it } = spec
import * as observe from '../src/combinator/observe'
import { iterate } from '../src/source/iterate'
import { take } from '../src/combinator/slice'
import { just as streamOf } from '../src/source/core'

var sentinel = { value: 'sentinel' }

describe('observe', function () {
  it('should call callback and return a promise', function () {
    var spy = this.spy()

    return observe.observe(spy, streamOf(sentinel))
      .then(function () {
        expect(spy).toHaveBeenCalledWith(sentinel)
      })
  })

  it('should call callback with expected values until end', function () {
    var n = 5
    var s = take(n, iterate(function (x) {
      return x + 1
    }, 0))

    var y = 0
    var spy = this.spy(function (x) {
      expect(x).toBe(y++)
    })

    return observe.observe(spy, s)
      .then(function () {
        expect(y).toBe(n)
      })
  })
})

describe('drain', function () {
  it('should drain all events', function () {
    var n = 5
    var s = take(n, iterate(function (x) {
      n -= 1
      return x + 1
    }, 0))

    n -= 1 // The initial value is emitted without calling the iterator function

    return observe.drain(s)
      .then(function () {
        expect(n).toBe(0)
      })
  })
})
