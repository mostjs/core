/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { findIndex, removeAll } from '@most/prelude'

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
    const i = binarySearch(getTime(st), this.tasks)

    if (i >= 0 && i < this.tasks.length) {
      const at = findIndex(st, this.tasks[i].events)
      if (at >= 0) {
        this.tasks[i].events.splice(at, 1)
        return true
      }
    }

    return false
  }

  // @deprecated
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

function insertByTime (task, timeslots) {
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

function insertAtTimeslot (task, timeslots, time, i) {
  const timeslot = timeslots[i]
  if (time === timeslot.time) {
    addEvent(task, timeslot.events, time)
  } else {
    timeslots.splice(i, 0, newTimeslot(time, [task]))
  }
}

function addEvent (task, events) {
  if (events.length === 0 || task.time >= events[events.length - 1].time) {
    events.push(task)
  } else {
    spliceEvent(task, events)
  }
}

function spliceEvent (task, events) {
  for (let j = 0; j < events.length; j++) {
    if (task.time < events[j].time) {
      events.splice(j, 0, task)
      break
    }
  }
}

function getTime (scheduledTask) {
  return Math.floor(scheduledTask.time)
}

// @deprecated
function removeAllFrom (f, timeslot) {
  timeslot.events = removeAll(f, timeslot.events)
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
