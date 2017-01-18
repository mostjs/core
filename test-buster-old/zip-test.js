import { spec, expect } from 'buster'
const { describe, it } = spec
import { take } from '../src/combinator/slice'
import { zip } from '../src/combinator/zip'
import { delay } from '../src/combinator/delay'
import { fromArray } from '../src/source/fromArray'

import { ticks, collectEvents } from './helper/testEnv'

describe('zip', function () {
  it('should invoke f for each tuple', function () {
    var a = [1, 2, 3]
    var b = [4, 5, 6]
    var s = zip(Array, delay(1, fromArray(a)), delay(0, fromArray(b)))

    return collectEvents(s, ticks(1))
      .then(function (events) {
        expect(events).toEqual([
          { time: 1, value: [1, 4] },
          { time: 1, value: [2, 5] },
          { time: 1, value: [3, 6] }
        ])
      })
  })

  it('should end when shortest stream ends', function () {
    var s = fromArray([1, 2, 3, 4])

    var a = take(2, s)
    var b = take(3, s)

    return collectEvents(zip(Array, a, b), ticks(2))
      .then(function (events) {
        expect(events.length).toBe(2)
      })
  })
})
