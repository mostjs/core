import { describe, it } from 'mocha'
import { assert } from '@briancavalier/assert'

import { assertSame } from '../helper/stream-helper'
import { ap } from '../../src/combinator/applicative'
import { now } from '../../src/source/now'
import { empty, isCanonicalEmpty } from '../../src/source/empty'
import { id } from '@most/prelude'

const sentinel = { value: 'sentinel' }

describe('ap', function () {
  it('should satisfy identity', function () {
    // P.of(function(a) { return a; }).ap(v) ~= v
    const v = now(sentinel)
    return assertSame(ap(now((x: unknown) => x), v), v)
  })

  it('should satisfy composition', function () {
    // P.of(function(f) { return function(g) { return function(x) { return f(g(x))}; }; }).ap(u).ap(v
    const u = now((x: string) => 'u' + x)
    const v = now((x: string) => 'v' + x)
    const w = now('w')

    return assertSame(
      ap(ap(ap(now((f: (x: string) => string) => (g: (x: string) => string) => (x: string) => f(g(x))), u), v), w),
      ap(u, ap(v, w))
    )
  })

  it('should satisfy homomorphism', function () {
    // P.of(f).ap(P.of(x)) ~= P.of(f(x)) (homomorphism)
    const f = (x: string): string => x + 'f'
    const x = 'x'
    return assertSame(ap(now(f), now(x)), now(f(x)))
  })

  it('should satisfy interchange', function () {
    // u.ap(a.of(y)) ~= a.of(function(f) { return f(y); }).ap(u)
    const f = (x: string): string => x + 'f'

    const u = now(f)
    const y = 'y'

    return assertSame(
      ap(u, now(y)),
      ap(now((f: (x: string) => string) => f(y)), u)
    )
  })

  describe('given a canonical empty stream of values', function () {
    it('should return a canonical empty stream', function () {
      // Fixture setup
      const arbitraryStreamOfFunctions = now(id)
      const emptyStreamOfValues = empty()
      // Exercise system
      const sut = ap(arbitraryStreamOfFunctions, emptyStreamOfValues)
      // Verify outcome
      assert(isCanonicalEmpty(sut))
    })
  })

  describe('given a canonical empty stream of functions', function () {
    it('should return a canonical empty stream', function () {
      // Fixture setup
      const emptyStreamOfFunctions = empty()
      const arbitraryStreamOfValues = now(1)
      // Exercise system
      const sut = ap(emptyStreamOfFunctions, arbitraryStreamOfValues)
      // Verify outcome
      assert(isCanonicalEmpty(sut))
    })
  })
})
