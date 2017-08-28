/** @license MIT License (c) copyright 2010-2015 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { newScheduler, newTimeline } from '@most/scheduler'
import {
  propagateEventTask,
  propagateEndTask
} from '../../src/scheduler/PropagateTask'
import VirtualTimer from './VirtualTimer'
import { runEffects } from '../../src/runEffects'
import { tap } from '../../src/combinator/transform'
import { disposeWith, disposeNone } from '@most/disposable'

export function newEnv () {
  const timer = new VirtualTimer()
  return {
    tick: n => timer.tick(n),
    scheduler: newScheduler(timer, newTimeline())
  }
}

export function ticks (dt) {
  const { tick, scheduler } = newEnv()
  tick(dt)
  return scheduler
}

export function collectEvents (stream, scheduler) {
  const into = []
  const s = tap(x => into.push({ time: scheduler.now(), value: x }), stream)
  return runEffects(s, scheduler).then(() => into)
}

export const collectEventsFor = (nticks, stream) =>
  collectEvents(stream, ticks(nticks))

export const makeEventsFromArray = (dt, a) =>
  atTimes(a.map((value, i) => ({ time: i * dt, value })))

export const makeEvents = (dt, n) =>
  makeEventsFromArray(dt, Array.from(Array(n), (_, i) => i))

export const atTime = (time, value) => atTimes([{ time, value }])

export const atTimes = array => new AtTimes(array)

class AtTimes {
  constructor (array) {
    this.events = array
  }

  run (sink, scheduler) {
    return this.events.length === 0
      ? disposeNone()
      : runEvents(this.events, sink, scheduler)
  }
}

const runEvents = (events, sink, scheduler) => {
  const s = events.reduce(appendEvent(sink, scheduler), { tasks: [], time: 0 })
  const end = scheduler.delay(s.time, propagateEndTask(sink))
  return disposeWith(cancelAll, s.tasks.concat(end))
}

const appendEvent = (sink, scheduler) => (s, event) => {
  const task = scheduler.delay(
    event.time,
    propagateEventTask(event.value, sink)
  )
  return { tasks: s.tasks.concat(task), time: Math.max(s.time, event.time) }
}

const cancelAll = tasks => Promise.all(tasks.map(cancelOne))

const cancelOne = task => task.dispose()
