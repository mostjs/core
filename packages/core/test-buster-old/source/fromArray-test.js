import { spec, referee } from 'buster'
const { describe, it } = spec
const { assert } = referee

import { fromArray } from '../../src/source/fromArray'

import { ticks, collectEvents } from '../helper/testEnv'

describe('fromArray', function () {
  it('should contain array items', function () {
    const a = [1, 2, 3]

    return collectEvents(fromArray(a), ticks(1))
      .then(events =>
        assert.equals(a, events.map(({ value }) => value)))
  })

  it('should support array-like items', function () {
    const arrayLike = { length: 3, 0: 1, 1: 2, 2: 3 }

    return collectEvents(fromArray(arrayLike), ticks(1))
      .then(events =>
        assert.equals([1, 2, 3], events.map(({ value }) => value)))
  })
})
