/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import IndexSink, { IndexedValue } from '../sink/IndexSink' // eslint-disable-line no-unused-vars
import { empty, isCanonicalEmpty } from '../source/empty'
import { disposeAll, tryDispose } from '@most/disposable'
import { reduce } from '@most/prelude'
import { Stream, Time, Disposable, Sink, Scheduler } from '@most/types' // eslint-disable-line no-unused-vars

/**
 * @returns stream containing events from two streams in time order.
 * If two events are simultaneous they will be merged in arbitrary order.
 */
export function merge <A, B> (stream1: Stream<A>, stream2: Stream<B>): Stream<A | B> {
  return mergeArray([stream1, stream2])
}

// TODO: use readonly Stream<any>[] once TS 3.4.x has been in the wild for "enough" time
type MergeArray<S extends ReadonlyArray<Stream<any>>> = Value<S[number]>
type Value<S> = S extends Stream<infer A> ? A : never

/**
 * @param streams array of stream to merge
 * @returns stream containing events from all input observables
 * in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
export const mergeArray = <S extends ReadonlyArray<Stream<any>>>(streams: S): Stream<MergeArray<S>> =>
  mergeStreams(withoutCanonicalEmpty(streams))

/**
 * This implements fusion/flattening for merge.  It will
 * fuse adjacent merge operations.  For example:
 * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
 * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
 * It does this by concatenating the sources arrays of
 * any nested Merge sources, in effect "flattening" nested
 * merge operations into a single merge.
 */
const mergeStreams = <A>(streams: Stream<A>[]): Stream<A> =>
  streams.length === 0 ? empty()
    : streams.length === 1 ? streams[0]
      : new Merge(reduce<Stream<A>[], Stream<A>>(appendSources, [], streams))

const withoutCanonicalEmpty = <A>(streams: ReadonlyArray<Stream<A>>): Stream<A>[] =>
  streams.filter(isNotCanonicalEmpty)

const isNotCanonicalEmpty = <A>(stream: Stream<A>): boolean =>
  !isCanonicalEmpty(stream)

const appendSources = <A>(sources: Stream<A>[], stream: Stream<A>): Stream<A>[] =>
  sources.concat(stream instanceof Merge ? stream.sources : stream)

class Merge<A> {
  readonly sources: Stream<A>[];

  constructor (sources: Stream<A>[]) {
    this.sources = sources
  }

  run (sink: Sink<A>, scheduler: Scheduler) {
    const l = this.sources.length
    const disposables: Disposable[] = new Array(l)
    const sinks: Sink<A>[] = new Array(l)

    const mergeSink = new MergeSink(disposables, sinks, sink)

    for (let indexSink, i = 0; i < l; ++i) {
      indexSink = sinks[i] = new IndexSink(i, mergeSink)
      disposables[i] = this.sources[i].run(indexSink, scheduler)
    }

    return disposeAll(disposables)
  }
}

class MergeSink<A> extends Pipe<A | IndexedValue<A>> {
  private readonly disposables: Disposable[];
  private activeCount: number;

  constructor (disposables: Disposable[], sinks: Sink<unknown>[], sink: Sink<A>) {
    super(sink)
    this.disposables = disposables
    this.activeCount = sinks.length
  }

  event (t: Time, indexValue: IndexedValue<A>) {
    if (!indexValue.active) {
      this._dispose(t, indexValue.index)
      return
    }
    this.sink.event(t, indexValue.value)
  }

  _dispose (t: Time, index: number) {
    tryDispose(t, this.disposables[index], this.sink)
    if (--this.activeCount === 0) {
      this.sink.end(t)
    }
  }
}
