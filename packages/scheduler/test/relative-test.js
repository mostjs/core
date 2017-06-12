// @flow
import { describe, it } from 'mocha'
import { eq } from '@briancavalier/assert'
import FakeScheduler from './helper/FakeScheduler'

import { schedulerRelativeTo } from '../src/relative'

describe('relative', () => {
  describe('schedulerRelativeTo', () => {
    it('should create scheduler with origin relative to other scheduler', () => {
      const origin = Math.random()
      const time = 1 + Math.random()
      const s = new FakeScheduler(time)

      const rs = schedulerRelativeTo(origin, s)

      eq(time - origin, rs.now())
    })
  })
})
