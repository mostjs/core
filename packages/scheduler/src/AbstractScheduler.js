// AbstractScheduler should not be exposed publicly
// Temporary mixin to reduce duplication between
// Scheduler and RelativeScheduler.  Eventually,
// the Scheduler interface will change and this
// can be removed.
export default class RelativeScheduler {
  asap (task) {
    return this.schedule(0, 0, -1, task)
  }

  delay (delay, task) {
    return this.schedule(0, delay, -1, task)
  }

  periodic (period, task) {
    return this.schedule(0, 0, period, task)
  }

  schedule (delay, period, task) {
    return this.schedule(0, delay, period, task)
  }
}
