import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { startWith } from '../src/combinator/startWith'
import { empty } from '../src/source/empty'

import { collectEventsFor } from './helper/testEnv'

describe('startWith', function () {
  it('should return a stream containing item as head', function () {
    const value = Math.random()
    const s = startWith(value, empty())

    return collectEventsFor(1, s).then(eq([{ time: 0, value }]))
  })
})
