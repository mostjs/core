/** @license MIT License (c) copyright 2018 original author or authors */

import { delay } from '@most/scheduler'
import { propagateEventTask, propagateEndTask } from '@most/core'
import { disposeWith, disposeNone } from '@most/disposable'
import { curry2, curry4 } from '@most/prelude'

const appendEvent = curry4(function (sink, scheduler, {tasks, time}, event) {
  const task = delay(event.time, propagateEventTask(event.value, sink), scheduler)
  return {tasks: tasks.concat(task), time: Math.max(time, event.time)}
})

const cancelAll = (tasks) => {
  Promise.all(tasks.map((task) => task.dispose()))
}

function runEvents (events, sink, scheduler) {
  const {tasks, time} = events.reduce(appendEvent(sink, scheduler), {tasks: [], time: 0})
  const end = delay(time, propagateEndTask(sink), scheduler)
  return disposeWith(cancelAll, tasks.concat(end))
}

function atTimes (array) {
  return {
    run: (sink, scheduler) => array.length === 0
      ? disposeNone()
      : runEvents(array, sink, scheduler)
  }
}

const makeEventsFromArray = curry2((dt, a) => atTimes(a.map((value, i) => ({time: i * dt, value}))))

const makeEvents = curry2((dt, n) => makeEventsFromArray(dt, Array.from(Array(n), (_, i) => i)))

export {
  makeEvents,
  makeEventsFromArray,
  atTimes
}
