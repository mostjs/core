import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { delay } from '../src/combinator/delay'
import { now } from '../src/source/now'
// import { at } from '../src/source/at'

// import { collectEventsFor } from './helper/testEnv'
import { collectEvents } from '@most/test'

describe('delay', function () {
  it('should delay events by delayTime', function () {
    const time = 10
    const value = Math.random()
    const s = delay(time, now(value))
    console.log(s)

    return collectEvents(s)
      .then(eq([{ time, value }]))
  })
})
