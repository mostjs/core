import { assert } from '@briancavalier/assert'
import { describe, it } from 'mocha'

import {
  isInfiniteBounds,
  isNilBounds,
  maxBounds,
  mergeBounds,
  minBounds,
  newBounds
} from '../../../src/combinator/slice/bounds'

const rInt = () =>
  Math.random() * Number.MAX_SAFE_INTEGER

const genBound = () =>
  Math.random() >= 0 ? rInt() : -rInt()

const testBounds = (gen, assert, n = 100) => {
  for (let i = 0; i < n; ++i) {
    assert(gen())
  }
}

const assertValidBounds = b =>
  assert(b.min >= 0 && b.max >= b.min)

describe('slice/bounds', () => {
  describe('newBounds', () => {
    it('should create valid bounds', () => {
      testBounds(() => newBounds(genBound(), genBound()), assertValidBounds)
    })
  })

  describe('minBounds', () => {
    it('should create valid bounds', () => {
      testBounds(() => minBounds(genBound()), assertValidBounds)
    })
  })

  describe('maxBounds', () => {
    it('should create valid bounds', () => {
      testBounds(() => maxBounds(genBound()), assertValidBounds)
    })
  })

  describe('mergeBounds', () => {
    it('should create valid bounds', () => {
      testBounds(
        () => mergeBounds(newBounds(genBound(), genBound()), newBounds(genBound(), genBound())),
        assertValidBounds
      )
    })
  })

  describe('isNilBounds', () => {
    it('given min < max, should be false', () => {
      const min = rInt()
      assert(!isNilBounds(newBounds(min, min + rInt())))
    })
    it('given min >= max, should be true', () => {
      const min = rInt()
      assert(isNilBounds(newBounds(min, min - rInt())))
    })
  })

  describe('isInfiniteBounds', () => {
    it('given min <= 0 and max === Infinity, should be true', () => {
      assert(isInfiniteBounds(newBounds(-rInt(), Infinity)))
    })
    it('given min > 0, should be false', () => {
      assert(!isInfiniteBounds(newBounds(1 + rInt(), Infinity)))
    })
    it('given max < Infinity, should be false', () => {
      assert(!isInfiniteBounds(newBounds(0, 1 + rInt())))
    })
  })
})
