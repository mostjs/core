/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { empty } from '../source/core'
import { once } from '../disposable/dispose'
import Map from '../fusion/Map'

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream containing only up to the first n items from stream
 */
export const take = (n, stream) =>
  slice(0, n, stream)

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream with the first n items removed
 */
export const skip = (n, stream) =>
  slice(n, Infinity, stream)

/**
 * Slice a stream by index. Negative start/end indexes are not supported
 * @param {number} start
 * @param {number} end
 * @param {Stream} stream
 * @returns {Stream} stream containing items where start <= index < end
 */
export const slice = (start, end, stream) =>
  end <= start ? empty() : sliceSource(start, end, stream)

const sliceSource = (start, end, stream) =>
  stream instanceof Map ? commuteMapSlice(start, end, stream)
    : stream instanceof Slice ? fuseSlice(start, end, stream)
    : new Slice(start, end, stream)

const commuteMapSlice = (start, end, mapStream) =>
  Map.create(mapStream.f, sliceSource(start, end, mapStream.source))

function fuseSlice (start, end, sliceStream) {
  const fusedStart = start + sliceStream.min
  const fusedEnd = Math.min(end + sliceStream.min, sliceStream.max)
  return new Slice(fusedStart, fusedEnd, sliceStream.source)
}

class Slice {
  constructor (min, max, source) {
    this.source = source
    this.min = min
    this.max = max
  }

  run (sink, scheduler) {
    return new SliceSink(this.min, this.max - this.min, this.source, sink, scheduler)
  }
}

class SliceSink extends Pipe {
  constructor (skip, take, source, sink, scheduler) {
    super(sink)
    this.skip = skip
    this.take = take
    this.disposable = once(source.run(this, scheduler))
  }

  event (t, x) { // eslint-disable-line complexity
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
      this.dispose()
      this.sink.end(t, x)
    }
  }

  dispose () {
    return this.disposable.dispose()
  }
}

export const takeWhile = (p, stream) =>
  new TakeWhile(p, stream)

class TakeWhile {
  constructor (p, source) {
    this.p = p
    this.source = source
  }

  run (sink, scheduler) {
    return new TakeWhileSink(this.p, this.source, sink, scheduler)
  }
}

class TakeWhileSink extends Pipe {
  constructor (p, source, sink, scheduler) {
    super(sink)
    this.p = p
    this.active = true
    this.disposable = once(source.run(this, scheduler))
  }

  event (t, x) {
    if (!this.active) {
      return
    }

    const p = this.p
    this.active = p(x)

    if (this.active) {
      this.sink.event(t, x)
    } else {
      this.dispose()
      this.sink.end(t, x)
    }
  }

  dispose () {
    return this.disposable.dispose()
  }
}

export const skipWhile = (p, stream) =>
  new SkipWhile(p, stream)

class SkipWhile {
  constructor (p, source) {
    this.p = p
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new SkipWhileSink(this.p, sink), scheduler)
  }
}

class SkipWhileSink extends Pipe {
  constructor (p, sink) {
    super(sink)
    this.p = p
    this.skipping = true
  }

  event (t, x) {
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

