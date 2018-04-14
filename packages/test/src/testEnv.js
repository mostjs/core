/** @license MIT License (c) copyright 2018 original author or authors */

import { newScheduler, newTimeline, currentTime, delay } from '@most/scheduler'
import { propagateEventTask, propagateEndTask, runEffects, tap } from '@most/core'
import { disposeWith, disposeNone } from '@most/disposable'
import { curry2 } from '@most/prelude'
import newVirtualTimer from './VirtualTimer'

function newEnv () {
  const timer = newVirtualTimer()
  return {tick: timer.tick, scheduler: newScheduler(timer, newTimeline())}
}

function ticks (dt) {
  const {tick, scheduler} = newEnv()
  tick(dt)
  return scheduler
}

const collectEvents = curry2(function (stream, scheduler) {
  const into = []
  const s = tap((x) => into.push({time: currentTime(scheduler), value: x}), stream)
  return runEffects(s, scheduler).then(() => into)
})

const collectEventsFor = curry2((nticks, stream) => collectEvents(stream, ticks(nticks)))

const appendEvent = (sink, scheduler) => function ({tasks, time}, event) {
  const task = delay(event.time, propagateEventTask(event.value, sink), scheduler)
  return {tasks: tasks.concat(task), time: Math.max(time, event.time)}
}

const cancelOne = (task) => task.dispose()

const cancelAll = (tasks) => Promise.all(tasks.map(cancelOne))

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

const atTime = curry2((time, value) => atTimes([{time, value}]))

const makeEventsFromArray = curry2((dt, a) => atTimes(a.map((value, i) => ({time: i * dt, value}))))

const makeEvents = curry2((dt, n) => makeEventsFromArray(dt, Array.from(Array(n), (_, i) => i)))

export {
  newEnv,
  ticks,
  collectEvents,
  collectEventsFor,
  makeEventsFromArray,
  makeEvents,
  atTimes,
  atTime
}
