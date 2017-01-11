/** @license MIT License (c) copyright 2010-2016 original author or authors */

import Stream from '../Stream'
import { getIterator } from '../iterable'
import PropagateTask from '../scheduler/PropagateTask'

export const fromIterable = iterable =>
  new Stream(new IterableSource(iterable))

class IterableSource {
  constructor (iterable) {
    this.iterable = iterable
  }

  run (sink, scheduler) {
    return scheduler.asap(new PropagateTask(runProducer, getIterator(this.iterable), sink))
  }
}

function runProducer (t, iterator, sink) {
  let r = iterator.next()

  while (!r.done && this.active) {
    sink.event(t, r.value)
    r = iterator.next()
  }

  sink.end(t, r.value)
}
