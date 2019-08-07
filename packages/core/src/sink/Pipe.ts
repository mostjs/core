/** @license MIT License (c) copyright 2010-2017 original author or authors */
/** @author Brian Cavalier */
import { Sink, Time } from '@most/types' // eslint-disable-line no-unused-vars

export default class Pipe<A> {
  protected readonly sink: Sink<A>

  constructor (sink: Sink<A>) {
    this.sink = sink
  }

  event (t: Time, x: A) {
    return this.sink.event(t, x)
  }

  end (t: Time) {
    return this.sink.end(t)
  }

  error (t: Time, e: Error) {
    return this.sink.error(t, e)
  }
}
