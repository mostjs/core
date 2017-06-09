import AbstractScheduler from './AbstractScheduler'

export default class RelativeScheduler extends AbstractScheduler {
  constructor (offset, scheduler) {
    super()
    this.offset = offset
    this.scheduler = scheduler
  }

  now () {
    return this.scheduler.now() - this.offset
  }

  scheduleTask (localOffset, delay, period, task) {
    return this.scheduler.schedule(localOffset + this.offset, delay, period, task)
  }

  relative (offset) {
    return new RelativeScheduler(offset + this.offset, this.scheduler)
  }

  cancel (task) {
    return this.scheduler.cancel(task)
  }

  cancelAll (f) {
    return this.scheduler.cancelAll(f)
  }
}
