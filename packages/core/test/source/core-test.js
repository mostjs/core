import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { just, empty } from '../../src/source/core'

import { collectEventsFor } from '../../test-buster-old/helper/testEnv'

describe('just', function () {
  it('should contain one item', function () {
    const expected = Math.random()
    return collectEventsFor(1, just(expected))
      .then(eq([{ time: 0, value: expected }]))
  })
})

describe('empty', function () {
  it('should yield no items before end', function () {
    return collectEventsFor(1, empty()).then(eq([]))
  })
})
