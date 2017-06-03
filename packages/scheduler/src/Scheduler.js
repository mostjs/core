/** @license MIT License (c) copyright 2010-2017 original author or authors */

import ScheduledTask from './ScheduledTask'
import RelativeScheduler from './RelativeScheduler'
import { runTask } from './task'

export default class Scheduler {
  constructor (timer, timeline) {
    this.timer = timer
    this.timeline = timeline

    this._timer = null
    this._nextArrival = Infinity

    this._runReadyTasksBound = () => this._runReadyTasks(this.now())
  }

  now () {
    return this.timer.now()
  }

  asap (task) {
    return this.schedule(0, 0, -1, task)
  }

  delay (delay, task) {
    return this.schedule(0, delay, -1, task)
  }

  periodic (period, task) {
    return this.schedule(0, 0, period, task)
  }

  schedule (localOffset, delay, period, task) {
    const time = this.now() + Math.max(0, delay)
    const st = new ScheduledTask(time, localOffset, period, task, this)

    this.timeline.add(st)
    this._scheduleNextRun()
    return st
  }

  relative (offset) {
    return new RelativeScheduler(offset, this)
  }

  cancel (task) {
    task.active = false
    if (this.timeline.remove(task)) {
      this._reschedule()
    }
  }

  cancelAll (f) {
    this.timeline.removeAll(f)
    this._reschedule()
  }

  _reschedule () {
    if (this.timeline.isEmpty()) {
      this._unschedule()
    } else {
      this._scheduleNextRun(this.now())
    }
  }

  _unschedule () {
    this.timer.clearTimer(this._timer)
    this._timer = null
  }

  _scheduleNextRun () { // eslint-disable-line complexity
    if (this.timeline.isEmpty()) {
      return
    }

    const nextArrival = this.timeline.nextArrival()

    if (this._timer === null) {
      this._scheduleNextArrival(nextArrival)
    } else if (nextArrival < this._nextArrival) {
      this._unschedule()
      this._scheduleNextArrival(nextArrival)
    }
  }

  _scheduleNextArrival (nextArrival) {
    this._nextArrival = nextArrival
    const delay = Math.max(0, nextArrival - this.now())
    this._timer = this.timer.setTimer(this._runReadyTasksBound, delay)
  }

  _runReadyTasks () {
    this._timer = null
    this.timeline.runTasks(this.now(), runTask)
    this._scheduleNextRun()
  }
}
