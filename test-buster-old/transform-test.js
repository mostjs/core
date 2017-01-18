import { spec, expect } from 'buster'
const { describe, it } = spec
import { assertSame } from './helper/stream-helper'
import { map, tap, constant } from '../src/combinator/transform'
import { observe } from '../src/combinator/observe'
import { just as streamOf } from '../src/source/core'

var sentinel = { value: 'sentinel' }
var other = { value: 'other' }

describe('map', function () {
  it('should satisfy identity', function () {
    // u.map(function(a) { return a; })) ~= u
    var u = streamOf(sentinel)
    return assertSame(map(function (x) { return x }, u), u)
  })

  it('should satisfy composition', function () {
    // u.map(function(x) { return f(g(x)); }) ~= u.map(g).map(f)
    function f (x) { return x + 'f' }
    function g (x) { return x + 'g' }

    var u = streamOf('e')

    return assertSame(
      map(function (x) { return f(g(x)) }, u),
      map(f, map(g, u))
    )
  })
})

describe('constant', function () {
  it('should satisfy identity', function () {
    // u.constant(x) ~= u.map(function(){return x;})
    var u = streamOf('e')
    var x = 1
    function f () { return x }
    return assertSame(
      constant(x, u),
      map(f, u)
    )
  })
})

describe('tap', function () {
  it('should not transform stream items', function () {
    var s = tap(function () {
      return other
    }, streamOf(sentinel))

    return observe(function (x) {
      expect(x).toBe(sentinel)
    }, s)
  })
})
