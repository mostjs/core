/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { defer, DeferrableTask } from '../task' // eslint-disable-line no-unused-vars
import { Time, Sink } from '@most/types' // eslint-disable-line no-unused-vars

export interface Event<A> {
  time: Time;
  value: A;
}

export default class DeferredSink<A> {
  private readonly events: Event<A>[];
  private readonly sink: Sink<A>
  active: boolean;

  constructor (sink: Sink<A>) {
    this.sink = sink
    this.events = []
    this.active = true
  }

  event (t: Time, x: A) {
    if (!this.active) {
      return
    }

    if (this.events.length === 0) {
      defer(new PropagateAllTask(this.sink, t, this.events))
    }

    this.events.push({ time: t, value: x })
  }

  end (t: Time) {
    if (!this.active) {
      return
    }

    this._end(new EndTask(t, this.sink))
  }

  error (t: Time, e: Error) {
    this._end(new ErrorTask(t, e, this.sink))
  }

  _end <E, A> (task: DeferrableTask<E, A>) {
    this.active = false
    defer(task)
  }
}

class PropagateAllTask<A> {
  private readonly sink: Sink<A>
  private time: Time
  private readonly events: Event<A>[]

  constructor (sink: Sink<A>, time: Time, events: Event<A>[]) {
    this.sink = sink
    this.events = events
    this.time = time
  }

  run () {
    const events = this.events
    const sink = this.sink
    let event

    for (let i = 0, l = events.length; i < l; ++i) {
      event = events[i]
      this.time = event.time
      sink.event(event.time, event.value)
    }

    events.length = 0
  }

  error (e: Error) {
    this.sink.error(this.time, e)
  }
}

class EndTask {
  private readonly time: Time;
  private readonly sink: Sink<never>

  constructor (t: Time, sink: Sink<never>) {
    this.time = t
    this.sink = sink
  }

  run () {
    this.sink.end(this.time)
  }

  error (e: Error) {
    this.sink.error(this.time, e)
  }
}

class ErrorTask {
  private readonly time: Time;
  private readonly value: Error;
  private readonly sink: Sink<unknown>;

  constructor (t: Time, e: Error, sink: Sink<unknown>) {
    this.time = t
    this.value = e
    this.sink = sink
  }

  run () {
    this.sink.error(this.time, this.value)
  }

  error (e: Error) {
    throw e
  }
}
