/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */
import { Sink, Time } from '@most/types'

export default class SafeSink<A> implements Sink<A> {
  private readonly sink: Sink<A>
  private active: boolean;

  constructor (sink: Sink<A>) {
    this.sink = sink
    this.active = true
  }

  event (t: Time, x: A): void {
    if (!this.active) {
      return
    }
    this.sink.event(t, x)
  }

  end (t: Time): void{
    if (!this.active) {
      return
    }
    this.disable()
    this.sink.end(t)
  }

  error (t: Time, e: Error): void{
    this.disable()
    this.sink.error(t, e)
  }

  disable (): Sink<A> {
    this.active = false
    return this.sink
  }
}
