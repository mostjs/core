/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { delay } from '@most/scheduler'
import { Disposable, Scheduler, Sink, Stream, Time } from '@most/types'

import { PropagateEventTask } from '../scheduler/PropagateTask'

export const at = <A>(t: Time, x: A): Stream<A> => new At(t, x)

class At<A> implements Stream<A> {
  private readonly time: Time;
  private readonly value: A;

  constructor(t: Time, x: A) {
    this.time = t
    this.value = x
  }

  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    return delay(this.time, new PropagateEventAt(this.value, sink), scheduler)
  }
}

class PropagateEventAt<A> extends PropagateEventTask<A> {
  runIfActive(t: Time): void {
    super.runIfActive(t)
    this.sink.end(t)
  }
}
