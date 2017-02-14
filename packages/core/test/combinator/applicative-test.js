import { describe, it } from 'mocha'

import { assertSame } from '../helper/stream-helper'
import { ap } from '../../src/combinator/applicative'
import { just } from '../../src/source/core'

const sentinel = { value: 'sentinel' }

describe('ap', function () {
  it('should satisfy identity', function () {
    // P.of(function(a) { return a; }).ap(v) ~= v
    const v = just(sentinel)
    return assertSame(ap(just(x => x), v), v)
  })

  it('should satisfy composition', function () {
    // P.of(function(f) { return function(g) { return function(x) { return f(g(x))}; }; }).ap(u).ap(v
    const u = just(x => 'u' + x)
    const v = just(x => 'v' + x)
    const w = just('w')

    return assertSame(
      ap(ap(ap(just(f => g => x => f(g(x))), u), v), w),
      ap(u, ap(v, w))
    )
  })

  it('should satisfy homomorphism', function () {
    // P.of(f).ap(P.of(x)) ~= P.of(f(x)) (homomorphism)
    const f = x => x + 'f'
    const x = 'x'
    return assertSame(ap(just(f), just(x)), just(f(x)))
  })

  it('should satisfy interchange', function () {
    // u.ap(a.of(y)) ~= a.of(function(f) { return f(y); }).ap(u)
    const f = x => x + 'f'

    const u = just(f)
    const y = 'y'

    return assertSame(
      ap(u, just(y)),
      ap(just(f => f(y)), u)
    )
  })
})
