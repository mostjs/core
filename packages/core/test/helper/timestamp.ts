import Pipe from '../../src/sink/Pipe'
import { Stream, Sink, Scheduler, Time } from '@most/types' // eslint-disable-line no-unused-vars
import { Event } from '../../src/sink/DeferredSink' // eslint-disable-line no-unused-vars

export const timestamp = <A>(stream: Stream<A>) =>
  new Timestamp(stream)

class Timestamp<A> {
  private readonly stream: Stream<A>

  constructor (stream: Stream<A>) {
    this.stream = stream
  }

  run (sink: Sink<Event<A>>, scheduler: Scheduler) {
    return this.stream.run(new TimestampSink(sink), scheduler)
  }
}

class TimestampSink<A> extends Pipe<A | Event<A>> {
  event (time: Time, value: A) {
    this.sink.event(time, { time, value })
  }
}
