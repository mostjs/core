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

const rInt = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
  min + (Math.random() * (max - min))

const genBound = () =>
  Math.random() >= 0 ? rInt() : -rInt()

const assertValidBounds = gen => {
  for (let i = 0; i < 100; ++i) {
    const b = gen(i)
    assert(b.min >= 0 && b.max >= b.min)
  }
}

describe('slice/bounds', () => {
  describe('newBounds', () => {
    it('should create valid bounds', () => {
      assertValidBounds(() => newBounds(genBound(), genBound()))
    })
  })

  describe('minBounds', () => {
    it('should create valid bounds', () => {
      assertValidBounds(() => minBounds(genBound()))
    })
  })

  describe('maxBounds', () => {
    it('should create valid bounds', () => {
      assertValidBounds(() => maxBounds(genBound()))
    })
  })

  describe('mergeBounds', () => {
    it('should create valid bounds', () => {
      assertValidBounds(
        () => mergeBounds(newBounds(genBound(), genBound()), newBounds(genBound(), genBound()))
      )
    })
  })

  describe('isNilBounds', () => {
    it('given min < max, should be false', () => {
      const min = rInt()
      assert(!isNilBounds(newBounds(min, rInt(min))))
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
      assert(!isInfiniteBounds(newBounds(rInt(1), Infinity)))
    })
    it('given max < Infinity, should be false', () => {
      assert(!isInfiniteBounds(newBounds(0, rInt(1))))
    })
  })
})
