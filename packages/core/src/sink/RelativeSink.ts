import { Sink, Time } from '@most/types'

export default class RelativeSink<A> implements Sink<A> {
  readonly offset: number
  readonly sink: Sink<A>

  constructor (offset: number, sink: Sink<A>) {
    this.sink = sink
    this.offset = offset
  }

  event (t: Time, x: A): void {
    this.sink.event(t + this.offset, x)
  }

  error (t: Time, e: Error): void {
    this.sink.error(t + this.offset, e)
  }

  end (t: Time): void {
    this.sink.end(t + this.offset)
  }
}
