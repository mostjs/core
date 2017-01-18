import { spec, referee } from 'buster'
const { describe, it } = spec
const { assert } = referee

import { filter, skipRepeats, skipRepeatsWith } from '../src/combinator/filter'
import { fromArray } from '../src/source/fromArray'

import { ticks, collectEvents } from './helper/testEnv'

const sentinel = { value: 'sentinel' }
const other = { value: 'other' }

describe('filter', function () {
  it('should return a stream containing only allowed items', function () {
    let a = [sentinel, other, sentinel, other]
    let p = x => x === sentinel
    const s = filter(p, fromArray(a))

    return collectEvents(s, ticks(1))
      .then(events => {
        const expected = a.filter(p).map(value => ({ time: 0, value }))
        assert.equals(expected, events)
      })
  })
})

describe('skipRepeats', function () {
  it('should return a stream with repeated events removed', function () {
    const s = skipRepeats(fromArray([1, 2, 2, 3, 4, 4]))

    return collectEvents(s, ticks(1))
      .then(events =>
        assert.equals([
          { time: 0, value: 1 },
          { time: 0, value: 2 },
          { time: 0, value: 3 },
          { time: 0, value: 4 }],
          events))
  })
})

describe('skipRepeatsWith', function () {
  it('should use provided comparator to remove repeated events', function () {
    const eq = (a, b) => a.toLowerCase() === b.toLowerCase()
    const s = skipRepeatsWith(eq, fromArray(['a', 'b', 'B', 'c', 'D', 'd']))

    return collectEvents(s, ticks(1))
      .then(events =>
        assert.equals([
          { time: 0, value: 'a' },
          { time: 0, value: 'b' },
          { time: 0, value: 'c' },
          { time: 0, value: 'D' }],
          events))
  })
})
