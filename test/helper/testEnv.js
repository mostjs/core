/** @license MIT License (c) copyright 2010-2015 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Stream from '../../src/Stream'
import PropagateTask from '../../src/scheduler/PropagateTask'
import Scheduler from '../../src/scheduler/Scheduler'
import Timeline from '../../src/scheduler/Timeline'
import VirtualTimer from './VirtualTimer'
import { runEffects } from '../../src/runEffects'
import { tap } from '../../src/combinator/transform'
import { create as createDispose, empty as emptyDispose } from '../../src/disposable/dispose'

export function newEnv () {
  const timer = new VirtualTimer()
  return { tick: n => timer.tick(n), scheduler: new Scheduler(timer, new Timeline()) }
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

export const atTimes = array => new Stream(new AtTimes(array))

class AtTimes {
  constructor (array) {
    this.events = array
  }

  run (sink, scheduler) {
    return this.events.length === 0
      ? emptyDispose()
      : runEvents(this.events, sink, scheduler)
  }
}

const runEvents = (events, sink, scheduler) => {
  const s = events.reduce(appendEvent(sink, scheduler), { tasks: [], time: 0 })
  const end = scheduler.delay(s.time, PropagateTask.end(void 0, sink))
  return createDispose(cancelAll, s.tasks.concat(end))
}

const appendEvent = (sink, scheduler) => (s, event) => {
  const task = scheduler.delay(event.time, PropagateTask.event(event.value, sink))
  return { tasks: s.tasks.concat(task), time: Math.max(s.time, event.time) }
}

const cancelAll = tasks => Promise.all(tasks.map(cancelOne))

const cancelOne = task => task.dispose()
