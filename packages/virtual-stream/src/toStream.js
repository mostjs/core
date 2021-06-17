import { Finite, Errored } from './vstream'
import { propagateEventTask, propagateEndTask, propagateErrorTask } from '@most/core'
import { disposeWith } from '@most/disposable'

export const toStream = vstream =>
  new ToStream(vstream)

class ToStream {
  constructor (vstream) {
    this.vstream = vstream
  }

  run (sink, scheduler) {
    return runVStream(this.vstream, sink, scheduler)
  }
}

const runVStream = (vstream, sink, scheduler) => {
  const s = addEvents(vstream.events, sink, scheduler)
  return finish(vstream, sink, scheduler, s.tasks)
}

const addEvents = (events, sink, scheduler) =>
  events.reduce(addEvent(sink, scheduler), { tasks: [], time: 0 })

const addEvent = (sink, scheduler) => (s, event) => {
  const task = scheduler.delay(event.time, propagateEventTask(event.value, sink))
  return { tasks: s.tasks.concat(task), time: Math.max(s.time, event.time) }
}

const finish = (vstream, sink, scheduler, tasks) => {
  if (vstream instanceof Finite) {
    tasks.push(scheduler.delay(vstream.time, propagateEndTask(sink)))
  } else if (vstream instanceof Errored) {
    tasks.push(scheduler.delay(vstream.time, propagateErrorTask(vstream.error, sink)))
  }

  return disposeWith(cancelAll, tasks)
}

const cancelAll = tasks => tasks.forEach(cancelOne)
const cancelOne = task => task.dispose()
