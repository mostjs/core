import { spec, referee } from 'buster'
const { describe, it } = spec
const { assert } = referee

import { fromIterable } from '../../src/source/fromIterable'

import ArrayIterable from '../helper/ArrayIterable'
import { ticks, collectEvents } from '../helper/testEnv'

describe('fromIterable', function () {
  it('should contain iterable items', function () {
    const a = [1, 2, 3]

    return collectEvents(fromIterable(new ArrayIterable(a)), ticks(1))
      .then(events =>
        assert.equals(a, events.map(({ value }) => value)))
  })
})
