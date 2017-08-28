// @flow
import { describe, it } from 'mocha'
import { eq, fail } from '@briancavalier/assert'

import {
  zipArrayValues,
  withArrayValues
} from '../../src/combinator/withArrayValues'
import { empty } from '../../src/source/empty'

import { collectEventsFor, makeEvents } from '../helper/testEnv'

describe('withArrayValues', () => {
  describe('zipArrayValues', () => {
    it('should be empty for empty array', () => {
      const s = zipArrayValues(fail, [], makeEvents(1, 1))
      return collectEventsFor(1, s).then(eq([]))
    })

    it('should be empty for empty stream', () => {
      const s = zipArrayValues(fail, [1, 2, 3], empty())
      return collectEventsFor(1, s).then(eq([]))
    })

    it('should contain zipped values when more events than values', () => {
      const a = ['a', 'b', 'c']
      const n = a.length + 1
      const s = zipArrayValues((a, b) => a + String(b), a, makeEvents(1, n))

      return collectEventsFor(n, s).then(
        eq([
          { time: 0, value: 'a0' },
          { time: 1, value: 'b1' },
          { time: 2, value: 'c2' }
        ])
      )
    })

    it('should contain zipped values when more values than events', () => {
      const a = ['a', 'b', 'c']
      const n = a.length - 1
      const s = zipArrayValues((a, b) => a + String(b), a, makeEvents(1, n))

      return collectEventsFor(a.length, s).then(
        eq([{ time: 0, value: 'a0' }, { time: 1, value: 'b1' }])
      )
    })
  })

  describe('withArrayValues', () => {
    it('should be empty for empty array', () => {
      const s = withArrayValues([], makeEvents(1, 1))
      return collectEventsFor(1, s).then(eq([]))
    })

    it('should be empty for empty stream', () => {
      const s = withArrayValues([1, 2, 3], empty())
      return collectEventsFor(1, s).then(eq([]))
    })

    it('should contain array values when more events than values', () => {
      const a = ['a', 'b', 'c']
      const n = a.length + 1
      const s = withArrayValues(a, makeEvents(1, n))

      return collectEventsFor(n, s).then(
        eq([
          { time: 0, value: 'a' },
          { time: 1, value: 'b' },
          { time: 2, value: 'c' }
        ])
      )
    })

    it('should contain array values when more values than events', () => {
      const a = ['a', 'b', 'c']
      const n = a.length - 1
      const s = withArrayValues(a, makeEvents(1, n))

      return collectEventsFor(a.length, s).then(
        eq([{ time: 0, value: 'a' }, { time: 1, value: 'b' }])
      )
    })
  })
})
