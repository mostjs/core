import { describe, it } from 'mocha'
import { assert, is, eq } from '@briancavalier/assert'

import { awaitPromises, fromPromise } from '../../src/combinator/promises'
import { recoverWith } from '../../src/combinator/errors'
import { empty, isCanonicalEmpty } from '../../src/source/empty'
import { switchLatest } from '../../src/combinator/switch'
import { map } from '../../src/combinator/transform'

import { atTime, makeEventsFromArray, collectEventsFor } from '../helper/testEnv'

const sentinel = { value: 'sentinel' }
const other = { value: 'other' }

const rejected = (e: Error): Promise<never> => {
  const p = Promise.reject(e)
  // Squelch node's unhandled rejection reporting
  // It reports them as unhandled and then immediately as handled
  // This could hide valid errors, although it's unlikely as long
  // as every test here returns a promise.
  p.catch(() => {})
  return p
}

describe('promises', () => {
  describe('awaitPromises', function () {
    it('given canonical empty stream, should return canonical empty', () => {
      const s = awaitPromises(empty())
      assert(isCanonicalEmpty(s))
    })

    it('should await promises', function () {
      const s = awaitPromises(atTime(0, Promise.resolve(sentinel)))

      return collectEventsFor(10, s)
        .then(events => {
          eq(1, events.length)
          // How to assert something meaningful about the time
          // which is out of our control?
          eq(sentinel, events[0].value)
        })
    })

    it('should preserve event order', function () {
      const slow = new Promise(resolve => setTimeout(resolve, 10, other))
      const fast = Promise.resolve(sentinel)

      // delayed promise followed by already fulfilled promise
      const s = awaitPromises(makeEventsFromArray(0, [slow, fast]))

      return collectEventsFor(10, s).then(events => {
        eq(other, events[0].value)
        eq(sentinel, events[1].value)
      })
    })

    it('should propagate error if promise rejects', function () {
      const error = new Error()
      const s = awaitPromises(makeEventsFromArray(1, [Promise.resolve(), rejected(error), Promise.resolve()]))
      return collectEventsFor(1, s)
        .catch(is(error))
    })
  })

  describe('fromPromise', function () {
    it('should contain only promise\'s fulfillment value', function () {
      const s = fromPromise(Promise.resolve(sentinel))
      return collectEventsFor(10, s).then(events => {
        eq(1, events.length)
        eq(sentinel, events[0].value)
      })
    })

    it('should propagate error if promise rejects', function () {
      const error = new Error()
      const s = fromPromise(rejected(error))

      return collectEventsFor(1, s)
        .catch(is(error))
    })

    it('should be recoverable if promise rejects', function () {
      const s = recoverWith(() => atTime(1, sentinel), fromPromise(rejected(new Error())))

      return collectEventsFor(1, s)
        .then(eq([{ time: 1, value: sentinel }]))
    })

    it('should stop emitting after disposed', function () {
      const s = switchLatest(map(
        v => fromPromise(new Promise(resolve => setTimeout(() => resolve(v), 10))),
        makeEventsFromArray(1, [1, 2])
      ))
      return collectEventsFor(10, s)
        .then(events => {
          eq(2, events[0].value)
          eq(1, events.length)
        })
    })
  })
})
