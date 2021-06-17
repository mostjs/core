/** @license MIT License (c) copyright 2018 original author or authors */

// @flow

import type { TimeStampedEvents } from './collectors'
import type { Stream, Sink, Offset } from '@most/types'
import { delay } from '@most/scheduler'
import { propagateEventTask, propagateEndTask } from '@most/core'
import { disposeWith, disposeNone } from '@most/disposable'

const cancelAll = (tasks) => {
  Promise.all(tasks.map((task) => task.dispose()))
}

function runEvents<A> (events: TimeStampedEvents<A>, sink: Sink<A>, scheduler) {
  function appendEvent ({tasks, time}, event) {
    const task = delay(event.time, propagateEventTask(event.value, sink), scheduler)
    return {tasks: tasks.concat(task), time: Math.max(time, event.time)}
  }

  const {tasks, time} = events.reduce(appendEvent, {tasks: [], time: 0})
  const end = delay(time, propagateEndTask(sink), scheduler)
  return disposeWith(cancelAll, tasks.concat(end))
}

export function atTimes<A> (events: TimeStampedEvents<A>): Stream<A> {
  return {
    run: (sink, scheduler) => events.length === 0
      ? disposeNone()
      : runEvents(events, sink, scheduler)
  }
}

export function makeEventsFromArray<A> (dt: Offset, a: Array<A>): Stream<A> {
  return atTimes(a.map((value, i) => ({ time: i * dt, value })))
}

export const makeEvents = (dt: Offset, n: number): Stream<number> =>
  makeEventsFromArray(dt, Array.from(Array(n), (_: void, i) => i))
