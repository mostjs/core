import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { fromIterable } from '../../src/source/fromIterable'

import ArrayIterable from '../../test-buster-old/helper/ArrayIterable'
import { collectEventsFor } from '../../test-buster-old/helper/testEnv'

describe('fromIterable', function () {
  it('should contain iterable items', function () {
    const a = [1, 2, 3]
    const expected = a.map(value => ({ time: 0, value }))

    return collectEventsFor(1, fromIterable(new ArrayIterable(a)))
      .then(eq(expected))
  })
})
