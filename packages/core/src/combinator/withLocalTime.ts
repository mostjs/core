import RelativeSink from '../sink/RelativeSink'
import { schedulerRelativeTo } from '@most/scheduler'
import { Time, Stream, Sink, Scheduler } from '@most/types' // eslint-disable-line no-unused-vars

/**
 * Create a stream with its own local clock
 * This transforms time from the provided scheduler's clock to a stream-local
 * clock (which starts at 0), and then *back* to the scheduler's clock before
 * propagating events to sink.  In other words, upstream sources will see local times,
 * and downstream sinks will see non-local (original) times.
 */
export const withLocalTime = <A>(origin: Time, stream: Stream<A>): Stream<A> =>
  new WithLocalTime(origin, stream)

class WithLocalTime<A> {
  private readonly origin: Time;
  private readonly source: Stream<A>;

  constructor (origin: Time, source: Stream<A>) {
    this.origin = origin
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler) {
    return this.source.run(relativeSink(this.origin, sink), schedulerRelativeTo(this.origin, scheduler))
  }
}

/**
 * Accumulate offsets instead of nesting RelativeSinks, which can happen
 * with higher-order stream and combinators like continueWith when they're
 * applied recursively.
 */
export const relativeSink = <A>(origin: Time, sink: Sink<A>): Sink<A> =>
  sink instanceof RelativeSink
    ? new RelativeSink(origin + sink.offset, sink.sink)
    : new RelativeSink(origin, sink)
