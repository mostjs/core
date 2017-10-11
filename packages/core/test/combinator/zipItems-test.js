// @flow
import { describe, it } from 'mocha'
import { eq, fail } from '@briancavalier/assert'

import { zipItems, withItems } from '../../src/combinator/zipItems'
import { map } from '../../src/combinator/transform'
import { scan } from '../../src/combinator/scan'
import { switchLatest } from '../../src/combinator/switch'
import { empty } from '../../src/source/empty'
import { periodic } from '../../src/source/periodic'

import { collectEventsFor, makeEvents } from '../helper/testEnv'

describe('zipItems', () => {
  describe('zipItems', () => {
    it('should be empty given no items', () => {
      const s = zipItems(fail, [], makeEvents(1, 1))
      return collectEventsFor(1, s).then(eq([]))
    })

    it('should be empty given empty stream', () => {
      const s = zipItems(fail, [1, 2, 3], empty())
      return collectEventsFor(1, s).then(eq([]))
    })

    it('should contain zipped items given more events than items', () => {
      const a = ['a', 'b', 'c']
      const n = a.length + 1
      const s = zipItems((a, b) => a + String(b), a, makeEvents(1, n))

      return collectEventsFor(n, s)
        .then(eq([
          { time: 0, value: 'a0' },
          { time: 1, value: 'b1' },
          { time: 2, value: 'c2' }
        ]))
    })

    it('should contain zipped items given more values than items', () => {
      const a = ['a', 'b', 'c']
      const n = a.length - 1
      const s = zipItems((a, b) => a + String(b), a, makeEvents(1, n))

      return collectEventsFor(a.length, s)
        .then(eq([
          { time: 0, value: 'a0' },
          { time: 1, value: 'b1' }
        ]))
    })
  })

  describe('withItems', () => {
    it('should be empty given no items', () => {
      const s = withItems([], makeEvents(1, 1))
      return collectEventsFor(1, s).then(eq([]))
    })

    it('should be empty given empty stream', () => {
      const s = withItems([1, 2, 3], empty())
      return collectEventsFor(1, s).then(eq([]))
    })

    it('should contain items given more events than items', () => {
      const a = ['a', 'b', 'c']
      const n = a.length + 1
      const s = withItems(a, makeEvents(1, n))

      return collectEventsFor(n, s)
        .then(eq([
          { time: 0, value: 'a' },
          { time: 1, value: 'b' },
          { time: 2, value: 'c' }
        ]))
    })

    it('should contain items given more items than events', () => {
      const a = ['a', 'b', 'c']
      const n = a.length - 1
      const s = withItems(a, makeEvents(1, n))

      return collectEventsFor(a.length, s)
        .then(eq([
          { time: 0, value: 'a' },
          { time: 1, value: 'b' }
        ]))
    })

    describe('given https://www.webpackbin.com/bins/-KvrqudMj6C-0H494Itg', () => {
      it('should contain expected number of items', () => {
        // Regression test based on
        // https://www.webpackbin.com/bins/-KvrqudMj6C-0H494Itg
        const a1 = [1, 2]
        const a2 = [10, 20, 30]
        const expectedCount = (a1.length * a2.length) + 1

        const t1 = 2
        const t2 = t1 / 2

        const s1 = withItems(a1, periodic(t1))
        const s2 = withItems(a2, periodic(t2))

        const add = (x, y) => x + y

        const scanned = switchLatest(map(a => scan(add, a, s2), s1))

        return collectEventsFor(t1 * a1.length, scanned)
          .then(events => eq(expectedCount, events.length))
      })
    })
  })
})
