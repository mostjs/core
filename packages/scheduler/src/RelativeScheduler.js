import AbstractScheduler from './AbstractScheduler'

export default class RelativeScheduler extends AbstractScheduler {
  constructor (origin, scheduler) {
    super()
    this.origin = origin
    this.scheduler = scheduler
  }

  now () {
    return this.scheduler.now() - this.origin
  }

  scheduleTask (localOffset, delay, period, task) {
    return this.scheduler.scheduleTask(localOffset + this.origin, delay, period, task)
  }

  relative (origin) {
    return new RelativeScheduler(origin + this.origin, this.scheduler)
  }

  cancel (task) {
    return this.scheduler.cancel(task)
  }

  cancelAll (f) {
    return this.scheduler.cancelAll(f)
  }
}
