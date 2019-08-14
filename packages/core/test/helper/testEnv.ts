/** @license MIT License (c) copyright 2010-2015 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { newScheduler, newTimeline, currentTime, delay } from '@most/scheduler'
import { propagateEventTask, propagateEndTask } from '../../src/scheduler/PropagateTask'
import VirtualTimer from './VirtualTimer'
import { runEffects } from '../../src/runEffects'
import { tap } from '../../src/combinator/transform'
import { disposeWith, disposeNone } from '@most/disposable'
import { Stream, Scheduler, Disposable, ScheduledTask, Time, Sink } from '@most/types'
import { Event } from '../../src/sink/DeferredSink'

export interface Env {
  tick(n: number): void
  scheduler: Scheduler
}

export function newEnv (): Env {
  const timer = new VirtualTimer()
  return { tick: (n: number) => timer.tick(n), scheduler: newScheduler(timer, newTimeline()) }
}

export function ticks (dt: number): Scheduler {
  const { tick, scheduler } = newEnv()
  tick(dt)
  return scheduler
}

export function collectEvents <A> (stream: Stream<A>, scheduler: Scheduler): Promise<Event<A>[]> {
  const into: Event<A>[] = []
  const s = tap(x => into.push({ time: currentTime(scheduler), value: x }), stream)
  return runEffects(s, scheduler).then(() => into)
}

export const collectEventsFor = <A>(nticks: number, stream: Stream<A>): Promise<Event<A>[]> =>
  collectEvents(stream, ticks(nticks))

export const makeEventsFromArray = <A>(dt: number, a: A[]): Stream<A> =>
  atTimes(a.map((value, i) => ({ time: i * dt, value })))

export const makeEvents = (dt: number, n: number): Stream<number> =>
  makeEventsFromArray(dt, Array.from(Array(n), (_, i) => i))

export const atTime = <A>(time: Time, value: A): AtTimes<A> => atTimes([{ time, value }])

export const atTimes = <A>(array: Event<A>[]): AtTimes<A> => new AtTimes(array)

class AtTimes<A> {
  private readonly events: Event<A>[]
  constructor (array: Event<A>[]) {
    this.events = array
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.events.length === 0
      ? disposeNone()
      : runEvents(this.events, sink, scheduler)
  }
}

const runEvents = <A>(events: Event<A>[], sink: Sink<A>, scheduler: Scheduler): Disposable => {
  const s = events.reduce(appendEvent(sink, scheduler), { tasks: [], time: 0 })
  const end = delay(s.time, propagateEndTask(sink), scheduler)
  return disposeWith(cancelAll, s.tasks.concat(end))
}

interface Acc {
  tasks: ScheduledTask[]
  time: Time
}
const appendEvent = <A>(sink: Sink<A>, scheduler: Scheduler) => (s: Acc, event: Event<A>): Acc => {
  const task = delay(event.time, propagateEventTask(event.value, sink), scheduler)
  return { tasks: s.tasks.concat(task), time: Math.max(s.time, event.time) }
}

const cancelAll = (tasks: Disposable[]): Promise<void[]> => Promise.all(tasks.map(cancelOne))

const cancelOne = (task: Disposable): void => task.dispose()
