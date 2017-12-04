/** @license MIT License (c) copyright 2010 original author or authors */

import { map } from './transform'
import { empty, containsCanonicalEmpty } from '../source/empty'
import Pipe from '../sink/Pipe'
import IndexSink from '../sink/IndexSink'
import { disposeAll, tryDispose } from '@most/disposable'
import invoke from '../invoke'

/**
 * Combine latest events from two streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
export const combine = (f, stream1, stream2) =>
  combineArray(f, [stream1, stream2])

/**
* Combine latest events from all input streams
* @param {function(...events):*} f function to combine most recent events
* @param {[Stream]} streams most recent events
* @returns {Stream} stream containing the result of applying f to the most recent
*  event of each input stream, whenever a new event arrives on any stream.
*/
export const combineArray = (f, streams) =>
  streams.length === 0 || containsCanonicalEmpty(streams) ? empty()
    : streams.length === 1 ? map(f, streams[0])
    : new Combine(f, streams)

class Combine {
  constructor (f, sources) {
    this.f = f
    this.sources = sources
  }

  run (sink, scheduler) {
    const l = this.sources.length
    const disposables = new Array(l)
    const sinks = new Array(l)

    const mergeSink = new CombineSink(disposables, sinks, sink, this.f)

    for (let indexSink, i = 0; i < l; ++i) {
      indexSink = sinks[i] = new IndexSink(i, mergeSink)
      disposables[i] = this.sources[i].run(indexSink, scheduler)
    }

    return disposeAll(disposables)
  }
}

class CombineSink extends Pipe {
  constructor (disposables, sinks, sink, f) {
    super(sink)
    this.disposables = disposables
    this.sinks = sinks
    this.f = f

    const l = sinks.length
    this.awaiting = l
    this.values = new Array(l)
    this.hasValue = new Array(l).fill(false)
    this.activeCount = sinks.length
  }

  event (t, indexedValue) {
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

  _updateReady (index) {
    if (this.awaiting > 0) {
      if (!this.hasValue[index]) {
        this.hasValue[index] = true
        this.awaiting -= 1
      }
    }
    return this.awaiting
  }

  _dispose (t, index) {
    tryDispose(t, this.disposables[index], this.sink)
    if (--this.activeCount === 0) {
      this.sink.end(t)
    }
  }
}
