import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'
import { map } from '@most/prelude'

import { fromArray } from '../../src/source/fromArray'

import { collectEventsFor } from '../helper/testEnv'

describe('fromArray', function () {
  it('should contain array items', function () {
    const a = [1, 2, 3]
    const expected = map(value => ({ time: 0, value }), a)

    return collectEventsFor(1, fromArray(a))
      .then(eq(expected))
  })

  it('should support array-like items', function () {
    const a = { length: 3, 0: 1, 1: 2, 2: 3 }
    const expected = map(value => ({ time: 0, value }), a)

    return collectEventsFor(1, fromArray(a))
      .then(eq(expected))
  })
})
