// @flow
import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'

import { clockRelativeTo, RelativeClock, HRTimeClock } from '../src/clock'

describe('clock', () => {
  describe('RelativeClock', () => {
    it('should be relative to origin time and clock', () => {
      const origin = Math.random()
      const time = Math.random()
      const baseClock = { now: () => time }

      const expected = time - origin

      const c = new RelativeClock(baseClock, origin)

      eq(expected, c.now())
    })
  })

  describe('clockRelativeTo', () => {
    it('should be relative to origin clock', () => {
      let time = 0
      const baseClock = { now: () => time++ }

      const c = clockRelativeTo(baseClock)

      eq(1, c.now())
    })
  })

  describe('HRTimeClock', () => {
    it('should be relative to origin time and clock', () => {
      const origin = [10, 100000000]
      const hrt = [12, 137000000]

      const hrtime = ([millis, nanos]) =>
        [hrt[0] - millis, hrt[1] - nanos]

      const c = new HRTimeClock(hrtime, origin)
      eq(2037, c.now())
    })
  })
})
