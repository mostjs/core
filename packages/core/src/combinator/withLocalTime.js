import RelativeSink from '../sink/RelativeSink'
import { schedulerRelativeTo } from '@most/scheduler'

// Create a stream with its own local clock
// This transforms time from the provided scheduler's clock to a stream-local
// clock (which starts at 0), and then *back* to the scheduler's clock before
// propagating events to sink.  In other words, upstream sources will see local times,
// and downstream sinks will see non-local (original) times.
export const withLocalTime = (origin, stream) =>
  new WithLocalTime(origin, stream)

class WithLocalTime {
  constructor (origin, source) {
    this.origin = origin
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(relativeSink(this.origin, sink), schedulerRelativeTo(this.origin, scheduler))
  }
}

// Accumulate offsets instead of nesting RelativeSinks, which can happen
// with higher-order stream and combinators like continueWith when they're
// applied recursively.
export const relativeSink = (origin, sink) =>
  sink instanceof RelativeSink
    ? new RelativeSink(origin + sink.offset, sink.sink)
    : new RelativeSink(origin, sink)
