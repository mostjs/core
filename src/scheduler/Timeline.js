/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import * as base from '@most/prelude'

export default class Timeline {
  constructor () {
    this.tasks = []
  }

  nextArrival () {
    return this.isEmpty() ? Infinity : this.tasks[0].time
  }

  isEmpty () {
    return this.tasks.length === 0
  }

  add (st) {
    insertByTime(st, this.tasks)
  }

  remove (st) {
    const i = binarySearch(st.time, this.tasks)

    if (i >= 0 && i < this.tasks.length) {
      const at = base.findIndex(st, this.tasks[i].events)
      if (at >= 0) {
        this.tasks[i].events.splice(at, 1)
        return true
      }
    }

    return false
  }

  removeAll (f) {
    for (let i = 0; i < this.tasks.length; ++i) {
      removeAllFrom(f, this.tasks[i])
    }
  }

  runTasks (t, runTask) {
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

function runReadyTasks (runTask, events, tasks) { // eslint-disable-line complexity
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

function insertByTime (task, timeslots) { // eslint-disable-line complexity
  const l = timeslots.length

  if (l === 0) {
    timeslots.push(newTimeslot(task.time, [task]))
    return
  }

  const i = binarySearch(task.time, timeslots)

  if (i >= l) {
    timeslots.push(newTimeslot(task.time, [task]))
  } else if (task.time === timeslots[i].time) {
    timeslots[i].events.push(task)
  } else {
    timeslots.splice(i, 0, newTimeslot(task.time, [task]))
  }
}

function removeAllFrom (f, timeslot) {
  timeslot.events = base.removeAll(f, timeslot.events)
}

function binarySearch (t, sortedArray) { // eslint-disable-line complexity
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

const newTimeslot = (t, events) => ({ time: t, events: events })
