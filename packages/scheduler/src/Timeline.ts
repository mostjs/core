/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { findIndex, removeAll } from '@most/prelude'
import { Time, Timeline } from '@most/types'
import ScheduledTaskImpl from './ScheduledTask'

export default class TimelineImpl implements Timeline {
  private tasks: TimeSlot[];

  constructor () {
    this.tasks = []
  }

  nextArrival (): number {
    return this.isEmpty() ? Infinity : this.tasks[0].time
  }

  isEmpty (): boolean {
    return this.tasks.length === 0
  }

  add (st: ScheduledTaskImpl): void {
    insertByTime(st, this.tasks)
  }

  remove (st: ScheduledTaskImpl): boolean {
    const i = binarySearch(getTime(st), this.tasks)

    if (i >= 0 && i < this.tasks.length) {
      const events = this.tasks[i].events
      const at = findIndex(st, events)
      if (at >= 0) {
        events.splice(at, 1)
        if (events.length === 0) {
          this.tasks.splice(i, 1)
        }
        return true
      }
    }

    return false
  }

  /**
   * @deprecated
   */
  removeAll (f: (task: ScheduledTaskImpl) => boolean): void {
    for (let i = 0; i < this.tasks.length; ++i) {
      removeAllFrom(f, this.tasks[i])
    }
  }

  runTasks (t: Time, runTask: (task: ScheduledTaskImpl) => void): void {
    const tasks = this.tasks
    const l = tasks.length
    let i = 0

    while (i < l && tasks[i].time <= t) {
      ++i
    }

    this.tasks = tasks.slice(i)

    // Run all ready tasks
    for (let j = 0; j < i; ++j) {
      this.tasks = runReadyTasks(runTask, tasks[j].events, this.tasks)
    }
  }
}

function runReadyTasks (runTask: (task: ScheduledTaskImpl) => void, events: ScheduledTaskImpl[], tasks: TimeSlot[]): TimeSlot[] {
  for (let i = 0; i < events.length; ++i) {
    const task = events[i]

    if (task.active) {
      runTask(task)

      // Reschedule periodic repeating tasks
      // Check active again, since a task may have canceled itself
      if (task.period >= 0 && task.active) {
        task.time = task.time + task.period
        insertByTime(task, tasks)
      }
    }
  }

  return tasks
}

function insertByTime (task: ScheduledTaskImpl, timeslots: TimeSlot[]): void {
  const l = timeslots.length
  const time = getTime(task)

  if (l === 0) {
    timeslots.push(newTimeslot(time, [task]))
    return
  }

  const i = binarySearch(time, timeslots)

  if (i >= l) {
    timeslots.push(newTimeslot(time, [task]))
  } else {
    insertAtTimeslot(task, timeslots, time, i)
  }
}

function insertAtTimeslot (task: ScheduledTaskImpl, timeslots: TimeSlot[], time: Time, i: number): void {
  const timeslot = timeslots[i]
  if (time === timeslot.time) {
    addEvent(task, timeslot.events)
  } else {
    timeslots.splice(i, 0, newTimeslot(time, [task]))
  }
}

function addEvent (task: ScheduledTaskImpl, events: ScheduledTaskImpl[]): void {
  if (events.length === 0 || task.time >= events[events.length - 1].time) {
    events.push(task)
  } else {
    spliceEvent(task, events)
  }
}

function spliceEvent (task: ScheduledTaskImpl, events: ScheduledTaskImpl[]): void {
  for (let j = 0; j < events.length; j++) {
    if (task.time < events[j].time) {
      events.splice(j, 0, task)
      break
    }
  }
}

function getTime (scheduledTask: ScheduledTaskImpl): Time {
  return Math.floor(scheduledTask.time)
}

/**
 * @deprecated
 */
function removeAllFrom (f: (task: ScheduledTaskImpl) => boolean, timeslot: TimeSlot): void {
  timeslot.events = removeAll(f, timeslot.events)
}

function binarySearch (t: Time, sortedArray: TimeSlot[]): number {
  let lo = 0
  let hi = sortedArray.length
  let mid, y

  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2)
    y = sortedArray[mid]

    if (t === y.time) {
      return mid
    } else if (t < y.time) {
      hi = mid
    } else {
      lo = mid + 1
    }
  }
  return hi
}

interface TimeSlot {
  time: Time
  events: ScheduledTaskImpl[]
}
const newTimeslot = (t: Time, events: ScheduledTaskImpl[]): TimeSlot => ({ time: t, events: events })
