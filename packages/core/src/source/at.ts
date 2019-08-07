/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { propagateTask } from '../scheduler/PropagateTask'
import { delay } from '@most/scheduler'
import { Time, Stream, Sink, Scheduler } from '@most/types' // eslint-disable-line no-unused-vars

export const at = <A>(t: Time, x: A): Stream<A> => new At(t, x)

class At<A> {
  private readonly time: Time;
  private readonly value: A;

  constructor (t: Time, x: A) {
    this.time = t
    this.value = x
  }

  run (sink: Sink<A>, scheduler: Scheduler) {
    return delay(this.time, propagateTask(runAt, this.value, sink), scheduler)
  }
}

function runAt <A> (t: Time, x: A, sink: Sink<A>) {
  sink.event(t, x)
  sink.end(t)
}
