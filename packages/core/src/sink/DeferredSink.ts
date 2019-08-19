/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { defer, DeferrableTask } from '../task'
import { Time, Sink } from '@most/types'

export interface Event<A> {
  readonly time: Time
  readonly value: A
}

export default class DeferredSink<A> implements Sink<A> {
  private readonly events: Event<A>[];
  private readonly sink: Sink<A>
  active: boolean;

  constructor (sink: Sink<A>) {
    this.sink = sink
    this.events = []
    this.active = true
  }

  event (t: Time, x: A): void{
    if (!this.active) {
      return
    }

    if (this.events.length === 0) {
      defer(new PropagateAllTask(this.sink, t, this.events))
    }

    this.events.push({ time: t, value: x })
  }

  end (t: Time): void {
    if (!this.active) {
      return
    }

    this.handleTask(new EndTask(t, this.sink))
  }

  error (t: Time, e: Error): void {
    this.handleTask(new ErrorTask(t, e, this.sink))
  }

  private handleTask <E, A> (task: DeferrableTask<E, A>): void {
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

  run (): void {
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

  error (e: Error): void {
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

  run (): void{
    this.sink.end(this.time)
  }

  error (e: Error): void {
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

  run (): void {
    this.sink.error(this.time, this.value)
  }

  error (e: Error): void {
    throw e
  }
}
