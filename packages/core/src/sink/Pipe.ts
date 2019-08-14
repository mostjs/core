/** @license MIT License (c) copyright 2010-2017 original author or authors */
/** @author Brian Cavalier */
import { Sink, Time } from '@most/types'

export default class Pipe<A> implements Sink<A> {
  protected readonly sink: Sink<A>

  constructor (sink: Sink<A>) {
    this.sink = sink
  }

  event (t: Time, x: A): void {
    return this.sink.event(t, x)
  }

  end (t: Time): void {
    return this.sink.end(t)
  }

  error (t: Time, e: Error): void {
    return this.sink.error(t, e)
  }
}
