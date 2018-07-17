import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { delay } from '../src/combinator/delay'
import { now } from '../src/source/now'
import { switchLatest } from '../src/combinator/switch'
import { merge } from '../src/combinator/merge'
import { map } from '../src/combinator/transform'

import { collectEventsFor } from './helper/testEnv'

describe('delay', function () {
  it('should delay events by delayTime', function () {
    const time = 1
    const value = Math.random()
    const s = delay(time, now(value))

    return collectEventsFor(time + 1, s)
      .then(eq([{ time, value }]))
  })
  it('should produce a single event', function () {
    const time = 700
    const value = 2
    const request = merge(now(1), delay(200, now(2)))
    const result = map(request => delay(500, now(request)), request)

    const latest = switchLatest(result)

    return collectEventsFor(time, latest)
      .then(eq([{ time, value }]))
  })
})
