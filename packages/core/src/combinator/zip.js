/** @license MIT License (c) copyright 2010 original author or authors */

import { map } from './transform'
import { empty, containsCanonicalEmpty } from '../source/empty'
import Pipe from '../sink/Pipe'
import IndexSink from '../sink/IndexSink'
import { disposeAll } from '@most/disposable'
import { map as mapArray } from '@most/prelude'
import invoke from '../invoke'
import Queue from '../Queue'

/**
 * Combine two streams pairwise by index by applying f to values at corresponding
 * indices.  The returned stream ends when either of the input streams ends.
 * @param {function} f function to combine values
 * @returns {Stream} new stream with items at corresponding indices combined
 *  using f
 */
export function zip (f, stream1, stream2) {
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
export const zipArray = (f, streams) =>
  streams.length === 0 || containsCanonicalEmpty(streams) ? empty()
    : streams.length === 1 ? map(f, streams[0])
      : new Zip(f, streams)

class Zip {
  constructor (f, sources) {
    this.f = f
    this.sources = sources
  }

  run (sink, scheduler) {
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

class ZipSink extends Pipe {
  constructor (f, buffers, sinks, sink) {
    super(sink)
    this.f = f
    this.sinks = sinks
    this.buffers = buffers
  }

  event (t, indexedValue) {
    /* eslint complexity: [1, 5] */
    if (!indexedValue.active) {
      this._dispose(t, indexedValue.index)
      return
    }

    const buffers = this.buffers
    const buffer = buffers[indexedValue.index]

    buffer.push(indexedValue.value)

    if (buffer.length() === 1) {
      if (!ready(this.buffers)) {
        return
      }

      emitZipped(this.f, t, buffers, this.sink)

      if (ended(this.buffers, this.sinks)) {
        this.sink.end(t)
      }
    }
  }

  _dispose (t, index) {
    const buffer = this.buffers[index]
    if (buffer.isEmpty()) {
      this.sink.end(t)
    }
  }
}

const emitZipped = (f, t, buffers, sink) =>
  sink.event(t, invoke(f, mapArray(head, buffers)))

const head = buffer => buffer.shift()

function ended (buffers, sinks) {
  for (let i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty() && !sinks[i].active) {
      return true
    }
  }
  return false
}

function ready (buffers) {
  for (let i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty()) {
      return false
    }
  }
  return true
}
