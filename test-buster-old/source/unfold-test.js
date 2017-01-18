import { spec, expect } from 'buster'
const { describe, it } = spec
import { unfold } from '../../src/source/unfold'
import { take } from '../../src/combinator/slice'
import { observe } from '../../src/combinator/observe'

var sentinel = { value: 'sentinel' }
var other = { value: 'other' }

describe('unfold', function () {
  it('should call unfold with seed', function () {
    var s = take(1, unfold(function (x) {
      return { value: x, seed: x }
    }, sentinel))

    return observe(function (x) {
      expect(x).toBe(sentinel)
    }, s)
  })

  it('should unfold until end', function () {
    var count = 0
    var expected = 3

    var s = take(expected, unfold(function (x) {
      return { value: x, seed: x + 1 }
    }, 0))

    return observe(function (x) {
      expect(x).toBe(count)
      count++
    }, s).then(function () {
      expect(count).toBe(expected)
    })
  })

  it('should allow future events by returning a promise', function () {
    var count = 0
    var expected = 3

    var s = take(expected, unfold(function (x) {
      return Promise.resolve({ value: x, seed: x + 1 })
    }, 0))

    return observe(function (x) {
      expect(x).toBe(count)
      count++
    }, s).then(function () {
      expect(count).toBe(expected)
    })
  })

  it('should reject on error', function () {
    var spy = this.spy()
    var s = unfold(function () {
      throw sentinel
    }, other)

    return observe(spy, s).catch(function (e) {
      expect(spy).not.toHaveBeenCalled()
      expect(e).toBe(sentinel)
    })
  })
})
