import { spec, referee } from 'buster'
const { describe, it } = spec
const { assert } = referee

import { startWith, concat } from '../src/combinator/build'
import { just, empty } from '../src/source/core'
import { fromArray } from '../src/source/fromArray'
import { delay } from '../src/combinator/delay'

import { ticks, collectEvents } from './helper/testEnv'

const sentinel = { value: 'sentinel' }

const assertSingleEvent = value => events => {
  assert.same(1, events.length)
  assert.equals({ time: 0, value }, events[0])
}

describe('build', function () {
  describe('startWith', function () {
    it('should return a stream containing item as head', function () {
      const s = startWith(sentinel, empty())

      return collectEvents(s, ticks(1))
        .then(assertSingleEvent(sentinel))
    })
  })

  describe('concat', function () {
    it('should return a stream containing items from both streams in correct order', function () {
      const dt = 1
      const s1 = delay(dt, fromArray([1, 2]))
      const s2 = fromArray([3, 4])

      return collectEvents(concat(s1, s2), ticks(dt + 1))
        .then(events =>
          assert.equals([
            { time: 1, value: 1 },
            { time: 1, value: 2 },
            { time: 1, value: 3 },
            { time: 1, value: 4 }],
            events))
    })

    it('should satisfy left identity', function () {
      const s = concat(just(sentinel), empty())

      return collectEvents(s, ticks(1))
        .then(assertSingleEvent(sentinel))
    })

    it('should satisfy right identity', function () {
      const s = concat(empty(), just(sentinel))

      return collectEvents(s, ticks(1))
        .then(assertSingleEvent(sentinel))
    })
  })
})
