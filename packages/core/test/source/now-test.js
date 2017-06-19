import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { now } from '../../src/source/now'

import { collectEventsFor } from '../helper/testEnv'

describe('now', () => {
  it('should contain event at time 0', function () {
    const expected = Math.random()
    return collectEventsFor(1, now(expected))
      .then(eq([{ time: 0, value: expected }]))
  })
})
