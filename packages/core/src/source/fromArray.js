/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Stream from '../Stream'
import { propagateTask } from '../scheduler/PropagateTask'

export const fromArray = a =>
  new Stream(new ArraySource(a))

class ArraySource {
  constructor (a) {
    this.array = a
  }

  run (sink, scheduler) {
    return scheduler.asap(propagateTask(runProducer, this.array, sink))
  }
}

function runProducer (t, array, sink, task) {
  for (let i = 0, l = array.length; i < l && task.active; ++i) {
    sink.event(t, array[i])
  }

  task.active && end(t)

  function end (t) {
    sink.end(t)
  }
}
