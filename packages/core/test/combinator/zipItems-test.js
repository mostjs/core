// @flow
import { describe, it } from 'mocha'
import { eq, fail } from '@briancavalier/assert'

import { zipItems, withItems } from '../../src/combinator/zipItems'
import { empty } from '../../src/source/empty'

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
  })
})
