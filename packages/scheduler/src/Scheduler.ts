/** @license MIT License (c) copyright 2010-2017 original author or authors */

import ScheduledTaskImpl from './ScheduledTask'
import RelativeScheduler from './RelativeScheduler'
import { runTask } from './task'
import { Scheduler, Time, Timer, Timeline, Task, ScheduledTask } from '@most/types'

export default class SchedulerImpl implements Scheduler {
  private readonly timer: Timer
  private readonly timeline: Timeline
  private _timer: Time | null
  private _nextArrival: Time;
  private _runReadyTasksBound = () => this._runReadyTasks()

  constructor(timer: Timer, timeline: Timeline) {
    this.timer = timer
    this.timeline = timeline

    this._timer = null
    this._nextArrival = Infinity
  }

  currentTime(): Time {
    return this.timer.now()
  }

  scheduleTask(localOffset: Time, delay: Time, period: Time, task: Task): ScheduledTaskImpl {
    const time = this.currentTime() + Math.max(0, delay)
    const st = new ScheduledTaskImpl(time, localOffset, period, task, this)

    this.timeline.add(st)
    this._scheduleNextRun()
    return st
  }

  relative(offset: Time): Scheduler {
    return new RelativeScheduler(offset, this)
  }

  cancel(task: ScheduledTaskImpl): void {
    task.active = false
    if (this.timeline.remove(task)) {
      this._reschedule()
    }
  }

  // @deprecated
  cancelAll(f: (task: ScheduledTask) => boolean): void {
    this.timeline.removeAll(f)
    this._reschedule()
  }

  _reschedule(): void {
    if (this.timeline.isEmpty()) {
      this._unschedule()
    } else {
      this._scheduleNextRun()
    }
  }

  _unschedule(): void {
    this.timer.clearTimer(this._timer)
    this._timer = null
  }

  _scheduleNextRun(): void {
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

  _scheduleNextArrival(nextArrival: Time): void {
    this._nextArrival = nextArrival
    const delay = Math.max(0, nextArrival - this.currentTime())
    this._timer = this.timer.setTimer(this._runReadyTasksBound, delay)
  }

  _runReadyTasks(): void {
    this._timer = null
    this.timeline.runTasks(this.currentTime(), runTask)
    this._scheduleNextRun()
  }
}
