// @flow
import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'
import FakeScheduler from './helper/FakeScheduler'
import { noopTask } from './helper/FakeTask'

import RelativeScheduler from '../src/RelativeScheduler'

describe('RelativeScheduler', () => {
  describe('now', () => {
    it('should have expected origin', () => {
      const origin = Math.random()
      const time = 1 + Math.random()
      const s = new FakeScheduler(time)

      const rs = new RelativeScheduler(origin, s)

      eq(time - origin, rs.now())
    })
  })

  describe('scheduleTask', () => {
    it('should schedule task relative to underlying scheduler', () => {
      const origin = Math.random()
      const time = 1 + Math.random()
      const s = new FakeScheduler(time)

      const rs = new RelativeScheduler(origin, s)

      const localOffset = Math.random()
      const delay = Math.random()
      const period = Math.random()
      const task = noopTask()

      const st = rs.scheduleTask(localOffset, delay, period, task)

      eq(time + delay, st.time)
      eq(localOffset + origin, st.localOffset)
      eq(period, st.period)
      assert(st.active)
      is(s, st.scheduler)
      is(task, st.task)
    })
  })

  describe('relative', () => {
    it('should create RelativeScheduler relative to original', () => {
      const origin1 = Math.random()
      const time = 1 + Math.random()
      const s = new FakeScheduler(time)

      const rs1 = new RelativeScheduler(origin1, s)

      const origin2 = Math.random()

      const rs2 = rs1.relative(origin2)

      eq(origin1 + origin2, rs2.origin)
    })
  })

  describe('cancel', () => {
    it('should set task active = false', () => {
      const origin = Math.random()
      const time = 1 + Math.random()
      const s = new FakeScheduler(time)

      const rs = new RelativeScheduler(origin, s)

      const localOffset = Math.random()
      const delay = Math.random()
      const period = Math.random()
      const task = noopTask()

      const st = rs.scheduleTask(localOffset, delay, period, task)

      assert(st.active)

      rs.cancel(st)

      assert(!st.active)
    })
  })

  describe('cancelAll', () => {
    it('should set task active = false', () => {
      const origin = Math.random()
      const time = 1 + Math.random()
      const s = new FakeScheduler(time)

      const rs = new RelativeScheduler(origin, s)

      const localOffset = Math.random()
      const delay = Math.random()
      const period = Math.random()
      const task = noopTask()

      const st = rs.scheduleTask(localOffset, delay, period, task)

      assert(st.active)

      rs.cancelAll(task => st === task)

      assert(!st.active)
    })
  })
})
