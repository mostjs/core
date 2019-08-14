import { Scheduler, Time, Task, ScheduledTask } from '@most/types'

export default class RelativeScheduler implements Scheduler {
  readonly origin: Time;
  readonly scheduler: Scheduler;

  constructor (origin: Time, scheduler: Scheduler) {
    this.origin = origin
    this.scheduler = scheduler
  }

  currentTime (): Time {
    return this.scheduler.currentTime() - this.origin
  }

  scheduleTask (localOffset: Time, delay: Time, period: Time, task: Task): ScheduledTask {
    return this.scheduler.scheduleTask(localOffset + this.origin, delay, period, task)
  }

  relative (origin: Time): Scheduler {
    return new RelativeScheduler(origin + this.origin, this.scheduler)
  }

  cancel (task: ScheduledTask): void {
    return this.scheduler.cancel(task)
  }

  cancelAll (f: (task: ScheduledTask) => boolean): void {
    return this.scheduler.cancelAll(f)
  }
}
