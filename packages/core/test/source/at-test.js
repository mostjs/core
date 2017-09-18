// @flow
import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { at } from '../../src/source/at'

import { collectEvents } from '@most/test'

describe('at', () => {
  it('should contain event at time t', function () {
    const t = Math.floor(Math.random() * 100)
    const expected = Math.random()
    return collectEvents(at(t, expected))
      .then(eq([{ time: t, value: expected }]))
  })
})
