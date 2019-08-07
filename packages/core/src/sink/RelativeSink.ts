import { Sink, Time } from '@most/types' // eslint-disable-line no-unused-vars

export default class RelativeSink<A> {
  readonly offset: number
  readonly sink: Sink<A>

  constructor (offset: number, sink: Sink<A>) {
    this.sink = sink
    this.offset = offset
  }

  event (t: Time, x: A) {
    this.sink.event(t + this.offset, x)
  }

  error (t: Time, e: Error) {
    this.sink.error(t + this.offset, e)
  }

  end (t: Time) {
    this.sink.end(t + this.offset)
  }
}
