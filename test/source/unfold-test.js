import { describe, it } from 'mocha'
import { eq, is, fail } from '@briancavalier/assert'

import { unfold } from '../../src/source/unfold'
import { take } from '../../src/combinator/slice'
import { observe } from '../../src/combinator/observe'

import { collectEventsFor } from '../../test-buster-old/helper/testEnv'

const sentinel = { value: 'sentinel' }
const other = { value: 'other' }

describe('unfold', function () {
  it('should call unfold with seed', function () {
    const s = take(1, unfold(x => ({ value: x, seed: x }), sentinel))

    return collectEventsFor(1, s)
      .then(eq([{ time: 0, value: sentinel }]))
  })

  it('should unfold until end', function () {
    const expected = [
      { time: 0, value: 0 },
      { time: 0, value: 1 },
      { time: 0, value: 2 },
      { time: 0, value: 3 },
      { time: 0, value: 4 },
      { time: 0, value: 5 },
      { time: 0, value: 6 },
      { time: 0, value: 7 },
      { time: 0, value: 8 },
      { time: 0, value: 9 },
    ]

    const s = take(expected.length, unfold(x => ({ seed: x + 1, value: x }), 0))

    return collectEventsFor(1, s)
      .then(eq(expected))
  })

  it('should allow future events by returning a promise', function () {
    const n = 10
    const s = take(n, unfold(x => Promise.resolve({ seed: x + 1, value: x }), 0))

    let count = 0
    return observe(x => eq(count++, x), s)
      .then(() => eq(n, count))
  })

  it('should reject on error', function () {
    const s = unfold(() => {
      throw sentinel
    }, other)

    return collectEventsFor(1, s)
      .then(fail, is(sentinel))
  })
})
