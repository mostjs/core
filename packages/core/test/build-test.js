import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { startWith, concat } from '../src/combinator/build'
import { now } from '../src/source/now'
import { empty } from '../src/source/empty'
import { delay } from '../src/combinator/delay'

import { collectEventsFor, makeEventsFromArray } from './helper/testEnv'

const sentinel = { value: 'sentinel' }

const assertSingleEvent = value => events => {
  eq(1, events.length)
  eq({ time: 0, value }, events[0])
}

describe('build', function () {
  describe('startWith', function () {
    it('should return a stream containing item as head', function () {
      const s = startWith(sentinel, empty())

      return collectEventsFor(1, s)
        .then(assertSingleEvent(sentinel))
    })
  })

  describe('concat', function () {
    it('should return a stream containing items from both streams in correct order', function () {
      const dt = 1
      const s1 = delay(dt, makeEventsFromArray(1, [1, 2]))
      const s2 = makeEventsFromArray(1, [3, 4])

      return collectEventsFor(dt + 3, concat(s1, s2))
        .then(eq([
            { time: 1, value: 1 },
            { time: 2, value: 2 },
            { time: 2, value: 3 },
            { time: 3, value: 4 }]
        ))
    })

    it('should satisfy left identity', function () {
      const s = concat(now(sentinel), empty())

      return collectEventsFor(1, s)
        .then(assertSingleEvent(sentinel))
    })

    it('should satisfy right identity', function () {
      const s = concat(empty(), now(sentinel))

      return collectEventsFor(1, s)
        .then(assertSingleEvent(sentinel))
    })
  })
})
