import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { zip } from '../src/combinator/zip'

import { makeEvents, collectEventsFor } from './helper/testEnv'

describe('zip', function() {
  it('should invoke f for each tuple', function() {
    const n = 3
    const s = zip(Array, makeEvents(1, n), makeEvents(2, n))

    return collectEventsFor(n * 2, s).then(
      eq([
        { time: 0, value: [0, 0] },
        { time: 2, value: [1, 1] },
        { time: 4, value: [2, 2] }
      ])
    )
  })

  it('should end when shortest stream ends', function() {
    const n = 3
    const a = makeEvents(1, n)
    const b = makeEvents(1, n + 1)

    return collectEventsFor(n, zip(Array, a, b)).then(
      eq([
        { time: 0, value: [0, 0] },
        { time: 1, value: [1, 1] },
        { time: 2, value: [2, 2] }
      ])
    )
  })
})
