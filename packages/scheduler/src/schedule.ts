import { curry2, curry3 } from '@most/prelude'
import { Scheduler, Time, Task, ScheduledTask } from '@most/types'

/**
 * Read the current time from the provided Scheduler
 */
export const currentTime = (scheduler: Scheduler): Time =>
  scheduler.currentTime()

/**
 * Schedule a task to run as soon as possible, but
 * not in the current call stack
 */
export const asap = curry2((task: Task, scheduler: Scheduler): ScheduledTask =>
  scheduler.scheduleTask(0, 0, -1, task))

/**
 * Schedule a task to run after a millisecond delay
 */
export const delay = curry3((delay: Time, task: Task, scheduler: Scheduler): ScheduledTask =>
  scheduler.scheduleTask(0, delay, -1, task))

/**
 * Schedule a task to run periodically, with the
 * first run starting asap
 */
export const periodic = curry3((period: Time, task: Task, scheduler: Scheduler): ScheduledTask =>
  scheduler.scheduleTask(0, 0, period, task))

/**
 * Cancel a scheduledTask
 */
export const cancelTask = (scheduledTask: ScheduledTask): void =>
  scheduledTask.dispose()

/**
 * Cancel all ScheduledTasks for which a predicate is true
 * @deprecated Will be removed in 2.0.0
 */
export const cancelAllTasks = curry2((predicate: (task: ScheduledTask) => boolean, scheduler: Scheduler): void => {
  console.warn(`DEPRECATED cancelAllTasks to be removed in 2.0.0`)
  return scheduler.cancelAll(predicate)
})
