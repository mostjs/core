import { curry3, curry4 } from '@most/prelude'
import RelativeSink from './sink/RelativeSink'
import { schedulerRelativeTo } from '@most/scheduler'

// Run a Stream, sending all its events to the
// provided Sink.
export const runStream = curry3((sink, scheduler, stream) =>
    stream.run(sink, scheduler))

// Run a stream with its own localized clock
// This transforms time from the provided scheduler's clock to a stream-local
// clock (which starts at 0), and then *back* to the scheduler's clock before
// propagating events to sink.  In other words, stream.run will see local times,
// and sink will see scheduler times.
export const runStreamWithLocalTime = curry4((sink, scheduler, origin, stream) =>
  stream.run(relativeSink(origin, sink), schedulerRelativeTo(origin, scheduler)))

// Accumulate offsets instead of nesting RelativeSinks, which can happen
// with higher-order stream and combinators like continueWith when they're
// applied recursively.
export const relativeSink = (origin, sink) =>
  sink instanceof RelativeSink
    ? new RelativeSink(origin + sink.offset, sink.sink)
    : new RelativeSink(origin, sink)
