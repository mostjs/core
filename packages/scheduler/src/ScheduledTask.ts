/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { ScheduledTask, Time, Task, Scheduler } from '@most/types'

export default class ScheduledTaskImpl implements ScheduledTask {
  /**
   * @mutable
   */
  time: Time;
  readonly localOffset: Time;
  readonly period: Time;
  readonly task: Task;
  readonly scheduler: Scheduler;
  /**
   * @mutable
   */
  active: boolean;

  constructor(time: Time, localOffset: Time, period: Time, task: Task, scheduler: Scheduler) {
    this.time = time
    this.localOffset = localOffset
    this.period = period
    this.task = task
    this.scheduler = scheduler
    this.active = true
  }

  run(): void {
    return this.task.run(this.time - this.localOffset)
  }

  error(e: Error): void {
    return this.task.error(this.time - this.localOffset, e)
  }

  dispose(): void {
    this.active = false
    this.scheduler.cancel(this)
    return this.task.dispose()
  }
}
