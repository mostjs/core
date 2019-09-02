import Pipe from '../../src/sink/Pipe'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types'
import { Event } from './testEnv'

export const timestamp = <A>(stream: Stream<A>): Stream<Event<A>> =>
  new Timestamp(stream)

class Timestamp<A> implements Stream<Event<A>> {
  private readonly stream: Stream<A>

  constructor(stream: Stream<A>) {
    this.stream = stream
  }

  run(sink: Sink<Event<A>>, scheduler: Scheduler): Disposable {
    return this.stream.run(new TimestampSink(sink), scheduler)
  }
}

class TimestampSink<A> extends Pipe<A, Event<A>> implements Sink<A> {
  event(time: Time, value: A): void {
    this.sink.event(time, { time, value })
  }
}
