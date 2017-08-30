import { curry2, curry3 } from '@most/prelude'

// Read the current time from the provided Scheduler
export const currentTime = scheduler =>
  scheduler.currentTime()

// Schedule a task to run as soon as possible, but
// not in the current call stack
export const asap = curry2((task, scheduler) =>
  scheduler.scheduleTask(0, 0, -1, task))

// Schedule a task to run after a millisecond delay
export const delay = curry3((delay, task, scheduler) =>
  scheduler.scheduleTask(0, delay, -1, task))

// Schedule a task to run periodically, with the
// first run starting asap
export const periodic = curry3((period, task, scheduler) =>
  scheduler.scheduleTask(0, 0, period, task))

// Cancel a scheduledTask
export const cancelTask = scheduledTask =>
  scheduledTask.dispose()

// Cancel all ScheduledTasks for which a predicate
// is true
export const cancelAllTasks = curry2((predicate, scheduler) =>
  scheduler.cancelAll(predicate))
