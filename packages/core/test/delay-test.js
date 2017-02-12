import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { delay } from '../src/combinator/delay'
import { just } from '../src/source/core'

import { collectEventsFor } from '../test-buster-old/helper/testEnv'

describe('delay', function () {
  it('should delay events by delayTime', function () {
    const time = 1
    const value = Math.random()
    const s = delay(time, just(value))

    return collectEventsFor(time + 1, s)
      .then(eq([{ time, value }]))
  })
})
