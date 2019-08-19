import { empty, isCanonicalEmpty } from '../../source/empty'
import { boundsFrom, isNilBounds, isInfiniteBounds, mergeBounds, Bounds } from './bounds'
import Map from '../../fusion/Map'
import Pipe from '../../sink/Pipe'
import SettableDisposable from '../../disposable/SettableDisposable'
import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types'

/**
 * @param n
 * @param stream
 * @returns new stream containing only up to the first n items from stream
 */
export const take = <A>(n: number, stream: Stream<A>): Stream<A> =>
  slice(0, n, stream)

/**
 * @param n
 * @param stream
 * @returns new stream with the first n items removed
 */
export const skip = <A>(n: number, stream: Stream<A>): Stream<A> =>
  slice(n, Infinity, stream)

/**
 * Slice a stream by index. Negative start/end indexes are not supported
 * @param start
 * @param end
 * @param stream
 * @returns stream containing items where start <= index < end
 */
export const slice = <A>(start: number, end: number, stream: Stream<A>): Stream<A> =>
  sliceBounds(boundsFrom(start, end), stream)

const sliceBounds = <A>(bounds: Bounds, stream: Stream<A>): Stream<A> =>
  isSliceEmpty(bounds, stream) ? empty()
    : stream instanceof Map ? commuteMapSlice(bounds, stream)
      : stream instanceof Slice ? fuseSlice(bounds, stream)
        : createSlice(bounds, stream)

const isSliceEmpty = <A>(bounds: Bounds, stream: Stream<A>): boolean =>
  isCanonicalEmpty(stream) || isNilBounds(bounds)

const createSlice = <A>(bounds: Bounds, stream: Stream<A>): Stream<A> =>
  isInfiniteBounds(bounds) ? stream : new Slice(bounds, stream)

const commuteMapSlice = <A, B>(bounds: Bounds, mapStream: Map<A, B>): Stream<B> =>
  Map.create(mapStream.f, sliceBounds(bounds, mapStream.source))

const fuseSlice = <A>(bounds: Bounds, sliceStream: Slice<A>): Stream<A> =>
  sliceBounds(mergeBounds(sliceStream.bounds, bounds), sliceStream.source)

export class Slice<A> implements Stream<A> {
  readonly bounds: Bounds;
  readonly source: Stream<A>;

  constructor (bounds: Bounds, source: Stream<A>) {
    this.source = source
    this.bounds = bounds
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    const disposable = new SettableDisposable()
    const sliceSink = new SliceSink(this.bounds.min, this.bounds.max - this.bounds.min, sink, disposable)

    disposable.setDisposable(this.source.run(sliceSink, scheduler))

    return disposable
  }
}

class SliceSink<A> extends Pipe<A> implements Sink<A> {
  private skip: number
  private take: number
  private readonly disposable: Disposable
  constructor (skip: number, take: number, sink: Sink<A>, disposable: Disposable) {
    super(sink)
    this.skip = skip
    this.take = take
    this.disposable = disposable
  }

  event (t: Time, x: A): void {
    /* eslint complexity: [1, 4] */
    if (this.skip > 0) {
      this.skip -= 1
      return
    }

    if (this.take === 0) {
      return
    }

    this.take -= 1
    this.sink.event(t, x)
    if (this.take === 0) {
      this.disposable.dispose()
      this.sink.end(t)
    }
  }
}

export const takeWhile = <A>(p: (a: A) => boolean, stream: Stream<A>): Stream<A> =>
  isCanonicalEmpty(stream) ? empty()
    : new TakeWhile(p, stream)

class TakeWhile<A> implements Stream<A> {
  private readonly p: (a: A) => boolean;
  private readonly source: Stream<A>;

  constructor (p: (a: A) => boolean, source: Stream<A>) {
    this.p = p
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    const disposable = new SettableDisposable()
    const takeWhileSink = new TakeWhileSink(this.p, sink, disposable)

    disposable.setDisposable(this.source.run(takeWhileSink, scheduler))

    return disposable
  }
}

class TakeWhileSink<A> extends Pipe<A> implements Sink<A> {
  private readonly p: (a: A) => boolean
  private readonly disposable: Disposable
  private active: boolean;

  constructor (p: (a: A) => boolean, sink: Sink<A>, disposable: Disposable) {
    super(sink)
    this.p = p
    this.active = true
    this.disposable = disposable
  }

  event (t: Time, x: A): void {
    if (!this.active) {
      return
    }

    const p = this.p
    this.active = p(x)

    if (this.active) {
      this.sink.event(t, x)
    } else {
      this.disposable.dispose()
      this.sink.end(t)
    }
  }
}

export const skipWhile = <A>(p: (a: A) => boolean, stream: Stream<A>): Stream<A> =>
  isCanonicalEmpty(stream) ? empty()
    : new SkipWhile(p, stream)

class SkipWhile<A> implements Stream<A> {
  private readonly p: (a: A) => boolean
  private readonly source: Stream<A>

  constructor (p: (a: A) => boolean, source: Stream<A>) {
    this.p = p
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(new SkipWhileSink(this.p, sink), scheduler)
  }
}

class SkipWhileSink<A> extends Pipe<A> implements Sink<A> {
  private readonly p: (a: A) => boolean;
  private skipping: boolean;

  constructor (p: (a: A) => boolean, sink: Sink<A>) {
    super(sink)
    this.p = p
    this.skipping = true
  }

  event (t: Time, x: A): void {
    if (this.skipping) {
      const p = this.p
      this.skipping = p(x)
      if (this.skipping) {
        return
      }
    }

    this.sink.event(t, x)
  }
}

export const skipAfter = <A>(p: (a: A) => boolean, stream: Stream<A>): Stream<A> =>
  isCanonicalEmpty(stream) ? empty()
    : new SkipAfter(p, stream)

class SkipAfter<A> implements Stream<A> {
  private readonly p: (a: A) => boolean
  private readonly source: Stream<A>

  constructor (p: (a: A) => boolean, source: Stream<A>) {
    this.p = p
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(new SkipAfterSink(this.p, sink), scheduler)
  }
}

class SkipAfterSink<A> extends Pipe<A> implements Sink<A> {
  private readonly p: (a: A) => boolean;
  private skipping: boolean;

  constructor (p: (a: A) => boolean, sink: Sink<A>) {
    super(sink)
    this.p = p
    this.skipping = false
  }

  event (t: Time, x: A): void {
    if (this.skipping) {
      return
    }

    const p = this.p
    this.skipping = p(x)
    this.sink.event(t, x)

    if (this.skipping) {
      this.sink.end(t)
    }
  }
}
