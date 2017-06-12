// @flow
import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'
import { noopTask } from './helper/FakeTask'
import ScheduledTask from '../src/ScheduledTask'

import AbstractScheduler from '../src/AbstractScheduler'

class TestScheduler extends AbstractScheduler {
  scheduleTask (localOffset, delay, period, task) {
    return new ScheduledTask(localOffset + delay, localOffset, period, task, this)
  }

  now () {
    return 0
  }

  cancel (task) {}
  cancelAll (f) {}
}

const verifyScheduledTask = (time, period, task, scheduler, st) => {
  eq(time, st.time)
  eq(0, st.localOffset)
  eq(period, st.period)
  assert(st.active)
  is(task, st.task)
  is(scheduler, st.scheduler)
}

describe('AbstractScheduler', () => {
  describe('asap', () => {
    it('should schedule task with no delay, no period', () => {
      const s = new TestScheduler()
      const task = noopTask()

      const st = s.asap(task)

      verifyScheduledTask(0, -1, task, s, st)
    })
  })

  describe('delay', () => {
    it('should schedule task with expected delay, no period', () => {
      const s = new TestScheduler()
      const task = noopTask()
      const delay = Math.random()

      const st = s.delay(delay, task)

      verifyScheduledTask(delay, -1, task, s, st)
    })
  })

  describe('periodic', () => {
    it('should schedule task with no delay, expected period', () => {
      const s = new TestScheduler()
      const task = noopTask()
      const period = Math.random()

      const st = s.periodic(period, task)

      verifyScheduledTask(0, period, task, s, st)
    })
  })

  describe('schedule', () => {
    it('should schedule task with expected delay, expected period', () => {
      const s = new TestScheduler()
      const task = noopTask()
      const delay = Math.random()
      const period = Math.random()

      const st = s.schedule(delay, period, task)

      verifyScheduledTask(delay, period, task, s, st)
    })
  })
})
