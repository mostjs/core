import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { filter, skipRepeats, skipRepeatsWith } from '../src/combinator/filter'

import { collectEventsFor, makeEventsFromArray } from './helper/testEnv'

const sentinel = { value: 'sentinel' }
const other = { value: 'other' }

describe('filter', function () {
  it('should return a stream containing only allowed items', function () {
    const a = [sentinel, other, sentinel, other]
    const p = x => x === sentinel
    const s = filter(p, makeEventsFromArray(1, a))

    return collectEventsFor(a.length, s).then(
      eq([{ time: 0, value: sentinel }, { time: 2, value: sentinel }])
    )
  })
})

describe('skipRepeats', function () {
  it('should return a stream with repeated events removed', function () {
    const a = [1, 2, 2, 3, 4, 4]
    const s = skipRepeats(makeEventsFromArray(1, a))

    return collectEventsFor(a.length, s).then(
      eq([
        { time: 0, value: 1 },
        { time: 1, value: 2 },
        { time: 3, value: 3 },
        { time: 4, value: 4 }
      ])
    )
  })
})

describe('skipRepeatsWith', function () {
  it('should use provided comparator to remove repeated events', function () {
    const compare = (a, b) => a.toLowerCase() === b.toLowerCase()
    const a = ['a', 'b', 'B', 'c', 'D', 'd']
    const s = skipRepeatsWith(compare, makeEventsFromArray(1, a))

    return collectEventsFor(a.length, s).then(
      eq([
        { time: 0, value: 'a' },
        { time: 1, value: 'b' },
        { time: 3, value: 'c' },
        { time: 4, value: 'D' }
      ])
    )
  })
})
