// @flow
import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { millisecondClockFromNow, MillisecondClock, HRTimeClock } from '../src/clock'

describe('clock', () => {
  describe('MillisecondClock', () => {
    it('should be relative to origin', () => {
      const origin = Math.random()
      const time = Math.random()
      const now = () => time

      const expected = time - origin

      const c = new MillisecondClock(now, origin)

      eq(expected, c.now())
    })
  })

  describe('HRTimeClock', () => {
    it('should be relative to origin', () => {
      const origin = [10, 100000000]
      const hrt = [12, 137000000]

      const hrtime = ([millis, nanos]) =>
        [hrt[0] - millis, hrt[1] - nanos]

      const c = new HRTimeClock(hrtime, origin)
      eq(2037, c.now())
    })
  })

  describe('millisecondClockFromNow', () => {
    let time = 0
    const now = () => time++

    const c = millisecondClockFromNow(now)

    eq(1, c.now())
  })
})
