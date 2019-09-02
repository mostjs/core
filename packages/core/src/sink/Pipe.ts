/** @license MIT License (c) copyright 2010-2017 original author or authors */
/** @author Brian Cavalier */
import { Sink, Time } from '@most/types'

export default abstract class Pipe<A, B> implements Sink<A> {
  protected readonly sink: Sink<B>

  constructor(sink: Sink<B>) {
    this.sink = sink
  }

  abstract event (t: Time, x: A): void

  end(t: Time): void {
    return this.sink.end(t)
  }

  error(t: Time, e: Error): void {
    return this.sink.error(t, e)
  }
}
