// @flow
import { assert, eq } from '@briancavalier/assert'
import { describe, it } from 'mocha'

import { isInfiniteBounds, isNilBounds, mergeBounds, boundsFrom } from '../../../src/combinator/slice/bounds'

const rInt = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
  Math.floor(min + (Math.random() * (max - min)))

const rBound = () => rInt(-Number.MAX_SAFE_INTEGER)

const assertValidBounds = gen => {
  for (let i = 0; i < 100; ++i) {
    const b = gen()
    assert(b.min >= 0 && b.max >= b.min)
  }
}

describe('slice/bounds', () => {
  describe('boundsFrom', () => {
    it('should create valid bounds', () => {
      assertValidBounds(() => boundsFrom(rBound(), rBound()))
    })
  })

  describe('mergeBounds', () => {
    it('should create valid bounds', () => {
      assertValidBounds(
        () => mergeBounds(boundsFrom(rBound(), rBound()), boundsFrom(rBound(), rBound()))
      )
    })
    it('should accumulate min and keep lower max, relative to previously accumulated min', () => {
      const b1 = boundsFrom(2, 10)
      const b2 = boundsFrom(1, 5)
      const b = mergeBounds(b1, b2)
      eq(boundsFrom(3, 7), b)
    })
    it('should accumulate min and keep lower max, relative to previously accumulated min', () => {
      const b1 = boundsFrom(2, 5)
      const b2 = boundsFrom(1, 10)
      const b = mergeBounds(b1, b2)
      eq(boundsFrom(3, 5), b)
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
