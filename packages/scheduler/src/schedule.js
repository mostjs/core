import { curry2, curry3 } from '@most/prelude'

// Schedule a task to run as soon as possible, but
// not in the current call stack
export const asap = curry2((task, scheduler) =>
  scheduler.asap(task))

// Schedule a task to run after a millisecond delay
export const delay = curry3((delay, task, scheduler) =>
  scheduler.delay(delay, task))

// Schedule a task to run periodically, with the
// first run starting asap
export const periodic = curry3((period, task, scheduler) =>
  scheduler.periodic(period, task))

// Cancel a scheduledTask
export const cancelTask = scheduledTask =>
  scheduledTask.dispose()

// Cancel all ScheduledTasks for which a predicate
// is true
export const cancelAllTasks = curry2((predicate, scheduler) =>
  scheduler.cancelAll(predicate))
