/** @license MIT License (c) copyright 2010-2016 original author or authors */

import Stream from '../Stream'
import { getIterator } from '../iterable'
import { propagateTask } from '../scheduler/PropagateTask'

export const fromIterable = iterable =>
  new Stream(new IterableSource(iterable))

class IterableSource {
  constructor (iterable) {
    this.iterable = iterable
  }

  run (sink, scheduler) {
    return scheduler.asap(propagateTask(runProducer, getIterator(this.iterable), sink))
  }
}

function runProducer (t, iterator, sink, task) {
  let r = iterator.next()

  while (!r.done && task.active) {
    sink.event(t, r.value)
    r = iterator.next()
  }

  task.active && sink.end(t, r.value)
}
