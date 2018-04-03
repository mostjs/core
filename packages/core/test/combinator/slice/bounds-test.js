import { assert } from '@briancavalier/assert'
import { describe, it } from 'mocha'

import {
  isInfiniteBounds,
  isNilBounds,
  maxBounds,
  mergeBounds,
  minBounds,
  boundsFrom
} from '../../../src/combinator/slice/bounds'

const rInt = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Math.floor(min + (Math.random() * (max - min)))

const rBounds = () =>
  Math.random() >= 0.5 ? rInt() : -rInt()

const assertValidBounds = gen => {
  for (let i = 0; i < 100; ++i) {
    const b = gen(i)
    assert(b.min >= 0 && b.max >= b.min)
  }
}

describe('slice/bounds', () => {
  describe('boundsFrom', () => {
    it('should create valid bounds', () => {
      assertValidBounds(() => boundsFrom(rBounds(), rBounds()))
    })
  })

  describe('minBounds', () => {
    it('should create valid bounds', () => {
      assertValidBounds(() => minBounds(rBounds()))
    })
  })

  describe('maxBounds', () => {
    it('should create valid bounds', () => {
      assertValidBounds(() => maxBounds(rBounds()))
    })
  })

  describe('mergeBounds', () => {
    it('should create valid bounds', () => {
      assertValidBounds(
        () => mergeBounds(boundsFrom(rBounds(), rBounds()), boundsFrom(rBounds(), rBounds()))
      )
    })
  })

  describe('isNilBounds', () => {
    it('given min < max, should be false', () => {
      const min = rInt()
      assert(!isNilBounds(boundsFrom(min, rInt(min))))
    })
    it('given min >= max, should be true', () => {
      const min = rInt()
      assert(isNilBounds(boundsFrom(min, min - rInt())))
    })
  })

  describe('isInfiniteBounds', () => {
    it('given min <= 0 and max === Infinity, should be true', () => {
      assert(isInfiniteBounds(boundsFrom(-rInt(), Infinity)))
    })
    it('given min > 0, should be false', () => {
      assert(!isInfiniteBounds(boundsFrom(rInt(1), Infinity)))
    })
    it('given max < Infinity, should be false', () => {
      assert(!isInfiniteBounds(boundsFrom(0, rInt(1))))
    })
  })
})
