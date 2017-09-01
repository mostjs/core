import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { delay } from '../src/combinator/delay'
import { now } from '../src/source/now'

import { collectEventsFor } from './helper/testEnv'

describe('delay', function () {
  it('should delay events by delayTime', function () {
    const time = 1
    const value = Math.random()
    const s = delay(time, now(value))

    return collectEventsFor(time + 1, s).then(eq([{ time, value }]))
  })
})
