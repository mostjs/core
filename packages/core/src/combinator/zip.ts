/** @license MIT License (c) copyright 2010 original author or authors */

import { map } from './transform'
import { empty, containsCanonicalEmpty } from '../source/empty'
import Pipe from '../sink/Pipe'
import { IndexSink, IndexedValue } from '../sink/IndexSink'
import { disposeAll } from '@most/disposable'
import { map as mapArray } from '@most/prelude'
import invoke from '../invoke'
import Queue from '../Queue'
import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types'
import { ToStreamsArray } from './variadic'

interface NonEmptyQueue<A> extends Queue<A> {
  shift(): A
}

/**
 * Combine two streams pairwise by index by applying f to values at corresponding
 * indices.  The returned stream ends when either of the input streams ends.
 * @param {function} f function to combine values
 * @returns {Stream} new stream with items at corresponding indices combined
 *  using f
 */
export function zip <A, B, R> (f: (a: A, b: B) => R, stream1: Stream<A>, stream2: Stream<B>): Stream<R> {
  return zipArray(f, [stream1, stream2])
}

/**
* Combine streams pairwise (or tuple-wise) by index by applying f to values
* at corresponding indices.  The returned stream ends when any of the input
* streams ends.
* @param {function} f function to combine values
* @param {[Stream]} streams streams to zip using f
* @returns {Stream} new stream with items at corresponding indices combined
*  using f
*/
export const zipArray = <Args extends unknown[], R>(f: (...args: Args) => R, streams: ToStreamsArray<Args>): Stream<R> =>
  streams.length === 0 || containsCanonicalEmpty(streams) ? empty()
    : streams.length === 1 ? map(f as any, streams[0])
      : new Zip(f as any, streams)

class Zip<A, R> implements Stream<R> {
  private readonly f: (...args: A[]) => R
  private readonly sources: Stream<A>[]

  constructor (f: (...args: A[]) => R, sources: Stream<A>[]) {
    this.f = f
    this.sources = sources
  }

  run (sink: Sink<R>, scheduler: Scheduler): Disposable {
    const l = this.sources.length
    const disposables = new Array(l)
    const sinks = new Array(l)
    const buffers = new Array(l)

    const zipSink = new ZipSink(this.f, buffers, sinks, sink)

    for (let indexSink, i = 0; i < l; ++i) {
      buffers[i] = new Queue()
      indexSink = sinks[i] = new IndexSink(i, zipSink)
      disposables[i] = this.sources[i].run(indexSink, scheduler)
    }

    return disposeAll(disposables)
  }
}

class ZipSink<A, R> extends Pipe<IndexedValue<A>, R> implements Sink<IndexedValue<A>> {
  private readonly f: (...args: A[]) => R
  private readonly buffers: Queue<A>[]
  private readonly sinks: IndexSink<A>[]

  constructor (f: (...args: A[]) => R, buffers: Queue<A>[], sinks: IndexSink<A>[], sink: Sink<R>) {
    super(sink)
    this.f = f
    this.sinks = sinks
    this.buffers = buffers
  }

  event (t: Time, indexedValue: IndexedValue<A>): void {
    /* eslint complexity: [1, 5] */
    if (!indexedValue.active) {
      this.dispose(t, indexedValue.index)
      return
    }

    const buffers = this.buffers
    const buffer = buffers[indexedValue.index]

    buffer.push(indexedValue.value)

    if (buffer.length() === 1) {
      if (!ready(buffers)) {
        return
      }

      emitZipped(this.f, t, buffers, this.sink)

      if (ended(this.buffers, this.sinks)) {
        this.sink.end(t)
      }
    }
  }

  private dispose (t: Time, index: number): void {
    const buffer = this.buffers[index]
    if (buffer.isEmpty()) {
      this.sink.end(t)
    }
  }
}

const emitZipped = <A, R>(f: (...args: A[]) => R, t: Time, buffers: NonEmptyQueue<A>[], sink: Sink<R>): void =>
  sink.event(t, invoke(f, mapArray(head, buffers)))

const head = <A>(buffer: NonEmptyQueue<A>): A => buffer.shift()

function ended <A> (buffers: Queue<unknown>[], sinks: IndexSink<A>[]): boolean {
  for (let i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty() && !sinks[i].active) {
      return true
    }
  }
  return false
}

function ready <A> (buffers: Queue<A>[]): buffers is NonEmptyQueue<A>[] {
  for (let i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty()) {
      return false
    }
  }
  return true
}
