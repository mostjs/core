import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { empty } from '../../src/source/empty'

import { collectEventsFor } from '../helper/testEnv'

describe('empty', () => {
  it('should yield no items before end', () => {
    return collectEventsFor(1, empty()).then(eq([]))
  })
})
