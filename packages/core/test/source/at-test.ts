import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { at } from '../../src'

import { collectEventsFor } from '../helper/testEnv'

describe('at', () => {
  it('should contain event at time t', function () {
    const t = Math.floor(Math.random() * 100)
    const expected = Math.random()
    return collectEventsFor(t, at(t, expected))
      .then(eq([{ time: t, value: expected }]))
  })
  it('is auto-curried', function () {
    const at100 = at(100)
    eq(typeof at100, 'function')
    const s = at100('foo')
    eq(typeof s.run, 'function')
    eq(s.run.length, 2)
  })
})
