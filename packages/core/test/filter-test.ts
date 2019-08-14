import { describe, it } from 'mocha'
import { eq, assert } from '@briancavalier/assert'

import { filter, skipRepeats, skipRepeatsWith } from '../src/combinator/filter'

import { collectEventsFor, makeEventsFromArray } from './helper/testEnv'
import { empty, isCanonicalEmpty } from '../src/source/empty'

const sentinel = { value: 'sentinel' }
const other = { value: 'other' }

describe('filter', function () {
  it('should return a stream containing only allowed items', function () {
    const a = [sentinel, other, sentinel, other]
    const p = (x: typeof sentinel): boolean => x === sentinel
    const s = filter(p, makeEventsFromArray(1, a))

    return collectEventsFor(a.length, s)
      .then(eq([
        { time: 0, value: sentinel },
        { time: 2, value: sentinel }
      ]))
  })

  describe('given a canonical empty stream', function () {
    it('should return a canonical empty stream', function () {
      // Fixture setup
      const emptyStream = empty()
      // Exercise system
      const sut = filter(_ => _, emptyStream)
      // Verify outcome
      assert(isCanonicalEmpty(sut))
    })
  })
})

describe('skipRepeats', function () {
  it('given canonical empty stream, should return canonical empty', () => {
    const s = skipRepeats(empty())
    assert(isCanonicalEmpty(s))
  })

  it('should return a stream with repeated events removed', function () {
    const a = [1, 2, 2, 3, 4, 4]
    const s = skipRepeats(makeEventsFromArray(1, a))

    return collectEventsFor(a.length, s)
      .then(eq([
        { time: 0, value: 1 },
        { time: 1, value: 2 },
        { time: 3, value: 3 },
        { time: 4, value: 4 }
      ]))
  })
})

describe('skipRepeatsWith', function () {
  it('given canonical empty stream, should return canonical empty', () => {
    const s = empty()
    assert(isCanonicalEmpty(s))
  })

  it('should use provided comparator to remove repeated events', function () {
    const compare = (a: string, b: string): boolean => a.toLowerCase() === b.toLowerCase()
    const a = ['a', 'b', 'B', 'c', 'D', 'd']
    const s = skipRepeatsWith(compare, makeEventsFromArray(1, a))

    return collectEventsFor(a.length, s)
      .then(eq([
        { time: 0, value: 'a' },
        { time: 1, value: 'b' },
        { time: 3, value: 'c' },
        { time: 4, value: 'D' }
      ]))
  })
})
