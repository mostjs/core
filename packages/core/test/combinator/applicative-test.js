import { describe, it } from 'mocha'

import { assertSame } from '../helper/stream-helper'
import { ap } from '../../src/combinator/applicative'
import { now } from '../../src/source/now'

const sentinel = { value: 'sentinel' }

describe('ap', function() {
  it('should satisfy identity', function() {
    // P.of(function(a) { return a; }).ap(v) ~= v
    const v = now(sentinel)
    return assertSame(ap(now(x => x), v), v)
  })

  it('should satisfy composition', function() {
    // P.of(function(f) { return function(g) { return function(x) { return f(g(x))}; }; }).ap(u).ap(v
    const u = now(x => 'u' + x)
    const v = now(x => 'v' + x)
    const w = now('w')

    return assertSame(
      ap(ap(ap(now(f => g => x => f(g(x))), u), v), w),
      ap(u, ap(v, w))
    )
  })

  it('should satisfy homomorphism', function() {
    // P.of(f).ap(P.of(x)) ~= P.of(f(x)) (homomorphism)
    const f = x => x + 'f'
    const x = 'x'
    return assertSame(ap(now(f), now(x)), now(f(x)))
  })

  it('should satisfy interchange', function() {
    // u.ap(a.of(y)) ~= a.of(function(f) { return f(y); }).ap(u)
    const f = x => x + 'f'

    const u = now(f)
    const y = 'y'

    return assertSame(ap(u, now(y)), ap(now(f => f(y)), u))
  })
})
