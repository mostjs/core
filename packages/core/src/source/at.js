/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { propagateTask } from '../scheduler/PropagateTask'

export const at = (t, x) => new At(t, x)

class At {
  constructor (t, x) {
    this.time = t
    this.value = x
  }

  run (sink, scheduler) {
    return scheduler.delay(this.time, propagateTask(runAt, this.value, sink))
  }
}

function runAt (t, x, sink) {
  sink.event(t, x)
  sink.end(t)
}
