/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { propagateTask } from '../scheduler/PropagateTask'
import { delay } from '@most/scheduler'
import { Time, Stream, Sink, Scheduler, Disposable } from '@most/types'

export const at = <A>(t: Time, x: A): Stream<A> => new At(t, x)

class At<A> implements Stream<A> {
  private readonly time: Time;
  private readonly value: A;

  constructor (t: Time, x: A) {
    this.time = t
    this.value = x
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return delay(this.time, propagateTask(runAt, this.value, sink), scheduler)
  }
}

function runAt <A> (t: Time, x: A, sink: Sink<A>): void {
  sink.event(t, x)
  sink.end(t)
}
