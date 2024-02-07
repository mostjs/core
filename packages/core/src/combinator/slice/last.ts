import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types'
import { empty, isCanonicalEmpty } from '../../source/empty'

export const last = <A>(source: Stream<A>): Stream<A> =>
  isCanonicalEmpty(source) ? empty() : new Last(source)

class Last<A> implements Stream<A> {
  readonly source: Stream<A>;
  constructor(source: Stream<A>) {
    this.source = source
  }
  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(new LastSink(sink), scheduler)
  }
}

class LastSink<A> implements Sink<A> {
  static NO_VALUE = Object.create(null)
  readonly sink: Sink<A>
  constructor(sink: Sink<A>) {
    this.sink = sink
  }
  private lastValue: A = LastSink.NO_VALUE

  event(_t: Time, x: A): void {
    this.lastValue = x
  }

  error(t: Time, e: Error): void {
    return this.sink.error(t, e)
  }

  end(t: Time): void {
    if (this.lastValue !== LastSink.NO_VALUE) {
      this.sink.event(t, this.lastValue)
    }
    return this.sink.end(t)
  }
}
