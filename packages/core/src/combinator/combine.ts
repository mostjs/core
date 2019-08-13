/** @license MIT License (c) copyright 2010 original author or authors */

import { map } from './transform'
import { empty, containsCanonicalEmpty } from '../source/empty'
import Pipe from '../sink/Pipe'
import IndexSink, { IndexedValue } from '../sink/IndexSink' // eslint-disable-line no-unused-vars
import { disposeAll, tryDispose } from '@most/disposable'
import invoke from '../invoke'
import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types' // eslint-disable-line no-unused-vars
import { ToStreamsArray } from './variadic' // eslint-disable-line no-unused-vars

/**
 * Combine latest events from two streams
 * @param f function to combine most recent events
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
export const combineArray = <Args extends any[], R>(f: (...args: Args) => R, streams: ToStreamsArray<Args>): Stream<R> =>
  streams.length === 0 || containsCanonicalEmpty(streams) ? empty()
    : streams.length === 1 ? map(f as any, streams[0])
      : new Combine(f as any, streams)

class Combine<A, B> {
  private readonly f: (...args: A[]) => B
  private readonly sources: Stream<A>[];

  constructor (f: (...args: A[]) => B, sources: Stream<A>[]) {
    this.f = f
    this.sources = sources
  }

  run (sink: Sink<B>, scheduler: Scheduler) {
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

class CombineSink<A, B> extends Pipe<B | IndexedValue<A>> {
  private readonly disposables: Disposable[]
  private readonly f: (...args: A[]) => B
  private awaiting: number
  private hasValue: boolean[]
  private activeCount: number
  private readonly values: A[]

  constructor (disposables: Disposable[], length: number, sink: Sink<B>, f: (...args: A[]) => B) {
    super(sink)
    this.disposables = disposables
    this.f = f

    this.awaiting = length
    this.values = new Array(length)
    this.hasValue = new Array(length).fill(false)
    this.activeCount = length
  }

  event (t: Time, indexedValue: IndexedValue<A>) {
    if (!indexedValue.active) {
      this._dispose(t, indexedValue.index)
      return
    }

    const i = indexedValue.index
    const awaiting = this._updateReady(i)

    this.values[i] = indexedValue.value
    if (awaiting === 0) {
      this.sink.event(t, invoke(this.f, this.values))
    }
  }

  _updateReady (index: number) {
    if (this.awaiting > 0) {
      if (!this.hasValue[index]) {
        this.hasValue[index] = true
        this.awaiting -= 1
      }
    }
    return this.awaiting
  }

  _dispose (t: Time, index: number) {
    tryDispose(t, this.disposables[index], this.sink)
    if (--this.activeCount === 0) {
      this.sink.end(t)
    }
  }
}
