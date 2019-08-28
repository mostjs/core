/** @license MIT License (c) copyright 2010 original author or authors */

import { map } from './transform'
import { empty, containsCanonicalEmpty } from '../source/empty'
import Pipe from '../sink/Pipe'
import { IndexSink, IndexedValue } from '../sink/IndexSink'
import { disposeAll, tryDispose } from '@most/disposable'
import invoke from '../invoke'
import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types'
import { ToStreamsArray } from './variadic'

/**
 * Combine latest events from two streams
 * @param f function to combine most recent events
 * @param stream1
 * @param stream2
 * @returns stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
export const combine = <A, B, C>(f: (a: A, b: B) => C, stream1: Stream<A>, stream2: Stream<B>): Stream<C> =>
  combineArray(f, [stream1, stream2])

/**
* Combine latest events from all input streams
* @param f function to combine most recent events
* @param streams most recent events
* @returns stream containing the result of applying f to the most recent
*  event of each input stream, whenever a new event arrives on any stream.
*/
export const combineArray = <Args extends unknown[], R>(f: (...args: Args) => R, streams: ToStreamsArray<Args>): Stream<R> =>
  streams.length === 0 || containsCanonicalEmpty(streams) ? empty()
    : streams.length === 1 ? map(f as any, streams[0])
      : new Combine(f, streams)

class Combine<Args extends unknown[], B> implements Stream<B> {
  private readonly f: (...args: Args) => B
  private readonly sources: ToStreamsArray<Args>;

  constructor (f: (...args: Args) => B, sources: ToStreamsArray<Args>) {
    this.f = f
    this.sources = sources
  }

  run (sink: Sink<B>, scheduler: Scheduler): Disposable {
    const l = this.sources.length
    const disposables = new Array(l)
    const sinks = new Array(l)

    const mergeSink = new CombineSink(disposables, sinks.length, sink, this.f)

    for (let indexSink, i = 0; i < l; ++i) {
      indexSink = sinks[i] = new IndexSink(i, mergeSink)
      disposables[i] = this.sources[i].run(indexSink, scheduler)
    }

    return disposeAll(disposables)
  }
}

class CombineSink<A, Args extends A[], B> extends Pipe<IndexedValue<A>, B> implements Sink<IndexedValue<A>> {
  private readonly disposables: Disposable[]
  private readonly f: (...args: Args) => B
  private awaiting: number
  private readonly hasValue: boolean[]
  private activeCount: number
  private readonly values: Args

  constructor (disposables: Disposable[], length: number, sink: Sink<B>, f: (...args: Args) => B) {
    super(sink)
    this.disposables = disposables
    this.f = f

    this.awaiting = length
    this.values = new Array(length) as Args
    this.hasValue = new Array(length).fill(false)
    this.activeCount = length
  }

  event (t: Time, indexedValue: IndexedValue<A>): void {
    if (!indexedValue.active) {
      this.dispose(t, indexedValue.index)
      return
    }

    const i = indexedValue.index
    const awaiting = this.updateReady(i)

    this.values[i] = indexedValue.value
    if (awaiting === 0) {
      this.sink.event(t, invoke(this.f, this.values))
    }
  }

  private updateReady (index: number): number {
    if (this.awaiting > 0) {
      if (!this.hasValue[index]) {
        this.hasValue[index] = true
        this.awaiting -= 1
      }
    }
    return this.awaiting
  }

  private dispose (t: Time, index: number): void {
    tryDispose(t, this.disposables[index], this.sink)
    if (--this.activeCount === 0) {
      this.sink.end(t)
    }
  }
}
