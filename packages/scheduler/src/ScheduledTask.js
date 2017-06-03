/** @license MIT License (c) copyright 2010-2017 original author or authors */

export default class ScheduledTask {
  constructor (time, localOffset, period, task, scheduler) {
    this.time = time
    this.localOffset = localOffset
    this.period = period
    this.task = task
    this.scheduler = scheduler
    this.active = true
  }

  run () {
    return this.task.run(this.time - this.localOffset)
  }

  error (e) {
    return this.task.error(this.time - this.localOffset, e)
  }

  dispose () {
    this.scheduler.cancel(this)
    return this.task.dispose()
  }
}
