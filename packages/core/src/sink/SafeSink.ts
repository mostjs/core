/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */
import { Sink, Time } from '@most/types' // eslint-disable-line no-unused-vars

export default class SafeSink<A> {
  private readonly sink: Sink<A>
  active: boolean;

  constructor (sink: Sink<A>) {
    this.sink = sink
    this.active = true
  }

  event (t: Time, x: A) {
    if (!this.active) {
      return
    }
    this.sink.event(t, x)
  }

  end (t: Time) {
    if (!this.active) {
      return
    }
    this.disable()
    this.sink.end(t)
  }

  error (t: Time, e: Error) {
    this.disable()
    this.sink.error(t, e)
  }

  disable () {
    this.active = false
    return this.sink
  }
}
