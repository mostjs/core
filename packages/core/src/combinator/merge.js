/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import IndexSink from '../sink/IndexSink'
import { empty } from '../source/empty'
import { disposeAll, tryDispose } from '@most/disposable'
import { reduce } from '@most/prelude'

/**
 * @returns {Stream} stream containing events from two streams in time order.
 * If two events are simultaneous they will be merged in arbitrary order.
 */
export function merge (stream1, stream2) {
  return mergeArray([stream1, stream2])
}

/**
 * @param {Array} streams array of stream to merge
 * @returns {Stream} stream containing events from all input observables
 * in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
export const mergeArray = streams =>
  streams.length === 0 ? empty()
    : streams.length === 1 ? streams[0]
    : mergeStreams(streams)

/**
 * This implements fusion/flattening for merge.  It will
 * fuse adjacent merge operations.  For example:
 * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
 * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
 * It does this by concatenating the sources arrays of
 * any nested Merge sources, in effect "flattening" nested
 * merge operations into a single merge.
 */
const mergeStreams = streams =>
  new Merge(reduce(appendSources, [], streams))

const appendSources = (sources, stream) =>
  sources.concat(stream instanceof Merge ? stream.sources : stream)

class Merge {
  constructor (sources) {
    this.sources = sources
  }

  run (sink, scheduler) {
    const l = this.sources.length
    const disposables = new Array(l)
    const sinks = new Array(l)

    const mergeSink = new MergeSink(disposables, sinks, sink)

    for (let indexSink, i = 0; i < l; ++i) {
      indexSink = sinks[i] = new IndexSink(i, mergeSink)
      disposables[i] = this.sources[i].run(indexSink, scheduler)
    }

    return disposeAll(disposables)
  }
}

class MergeSink extends Pipe {
  constructor (disposables, sinks, sink) {
    super(sink)
    this.disposables = disposables
    this.activeCount = sinks.length
  }

  event (t, indexValue) {
    if (!indexValue.active) {
      this._dispose(t, indexValue.index)
      return
    }
    this.sink.event(t, indexValue.value)
  }

  _dispose (t, index) {
    tryDispose(t, this.disposables[index], this.sink)
    if (--this.activeCount === 0) {
      this.sink.end(t)
    }
  }
}
