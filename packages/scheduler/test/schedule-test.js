// @flow
import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'
import FakeScheduler from './helper/FakeScheduler'
import { noopTask } from './helper/FakeTask'

import { asap, delay, periodic } from '../src/schedule'

describe('schedule', () => {
  describe('asap', () => {
    it('should schedule a task at time 0', () => {
      const time = Math.random()
      const scheduler = new FakeScheduler(time)
      const task = noopTask()

      const st = asap(task, scheduler)

      eq(scheduler.now(), st.time)
      eq(0, st.localOffset)
      eq(-1, st.period)
      is(task, st.task)
      is(scheduler, st.scheduler)
      assert(st.active)
    })
  })

  describe('delay', () => {
    it('should schedule a task at delay time', () => {
      const time = Math.random()
      const scheduler = new FakeScheduler(time)
      const task = noopTask()
      const dt = Math.random()

      const st = delay(dt, task, scheduler)

      eq(scheduler.now() + dt, st.time)
      eq(0, st.localOffset)
      eq(-1, st.period)
      is(task, st.task)
      is(scheduler, st.scheduler)
      assert(st.active)
    })
  })

  describe('periodic', () => {
    it('should schedule a task at delay time', () => {
      const time = Math.random()
      const scheduler = new FakeScheduler(time)
      const task = noopTask()
      const period = Math.random()

      const st = periodic(period, task, scheduler)

      eq(scheduler.now(), st.time)
      eq(0, st.localOffset)
      eq(period, st.period)
      is(task, st.task)
      is(scheduler, st.scheduler)
      assert(st.active)
    })
  })
})
