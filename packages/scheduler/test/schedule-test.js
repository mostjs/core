// @flow
import { describe, it } from 'mocha'
import { eq, is, assert } from '@briancavalier/assert'
import FakeScheduler from './helper/FakeScheduler'
import { noopTask } from './helper/FakeTask'

import { asap, cancelAllTasks, cancelTask, currentTime, delay, periodic } from '../src/schedule'

describe('schedule', () => {
  describe('currentTime', () => {
    it('should read current time value from scheduler', () => {
      const time = Math.random()
      const scheduler = new FakeScheduler(time)

      eq(time, currentTime(scheduler))
    })
  })

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

  describe('cancelTask', () => {
    it('should cancel a ScheduledTask', () => {
      const scheduler = new FakeScheduler(Math.random())
      const task = noopTask()

      const st = asap(task, scheduler)

      cancelTask(st)

      assert(task.disposed)
      assert(!st.active)
    })
  })

  describe('cancelAllTasks', () => {
    it('should cancel only matching ScheduledTasks', () => {
      const scheduler = new FakeScheduler(Math.random())
      const t1 = noopTask()
      const t2 = noopTask()
      const t3 = noopTask()

      const st1 = asap(t1, scheduler)
      const st2 = asap(t2, scheduler)
      const st3 = asap(t3, scheduler)

      cancelAllTasks(st => st === st1 || st === st3, scheduler)

      assert(!st1.active)
      assert(t1.disposed)

      assert(st2.active)
      assert(!t2.disposed)

      assert(!st3.active)
      assert(t3.disposed)
    })
  })
})
