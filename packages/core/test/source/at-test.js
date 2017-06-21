// @flow
import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { at } from '../../src/source/at'

import { collectEventsFor } from '../helper/testEnv'

describe('at', () => {
  it('should contain event at time t', function () {
    const t = Math.floor(Math.random() * 100)
    const expected = Math.random()
    return collectEventsFor(t, at(t, expected))
      .then(eq([{ time: t, value: expected }]))
  })
})
