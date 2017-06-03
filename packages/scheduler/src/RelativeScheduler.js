
export default class RelativeScheduler {
  constructor(offset, scheduler) {
    this.offset = offset
    this.scheduler = scheduler
  }

  now () {
    return this.scheduler.now() - this.offset
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
    return this.scheduler.schedule(localOffset + this.offset, delay, period, task)
  }

  relative (offset) {
    return new RelativeScheduler(offset + this.offset, this.scheduler)
  }
}
