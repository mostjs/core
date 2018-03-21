/** @license MIT License (c) copyright 2010 original author or authors */

import Pipe from '../sink/Pipe'
import { empty, isCanonicalEmpty } from '../source/empty'
import Map from '../fusion/Map'
import SettableDisposable from '../disposable/SettableDisposable'

const createBounds = (min, max) =>
  ({ min, max })

const mergeBounds = (b1, b2) =>
  createBounds(b1.min + b2.min, Math.min(b1.max, b2.max))

const isEmptyBounds = b =>
  b.min >= b.max

const isInfinite = b =>
  b.min <= 0 && b.max === Infinity

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
  sliceBounds(createBounds(start, end), stream)

const sliceBounds = (bounds, stream) =>
  isSliceEmpty(bounds, stream) ? empty()
    : stream instanceof Map ? commuteMapSlice(bounds, stream)
    : stream instanceof Slice ? fuseSlice(bounds, stream)
    : createSlice(bounds, stream)

const isSliceEmpty = (bounds, stream) =>
  isCanonicalEmpty(stream) || isEmptyBounds(bounds)

const createSlice = (bounds, stream) =>
  isInfinite(bounds) ? stream : new Slice(bounds, stream)

const commuteMapSlice = (bounds, mapStream) =>
  Map.create(mapStream.f, sliceBounds(bounds, mapStream.source))

const fuseSlice = (bounds, sliceStream) =>
  sliceBounds(mergeBounds(bounds, sliceStream.bounds), sliceStream.source)

class Slice {
  constructor (bounds, source) {
    this.source = source
    this.bounds = bounds
  }

  run (sink, scheduler) {
    const disposable = new SettableDisposable()
    const sliceSink = new SliceSink(this.bounds.min, this.bounds.max - this.bounds.min, sink, disposable)

    disposable.setDisposable(this.source.run(sliceSink, scheduler))

    return disposable
  }
}

class SliceSink extends Pipe {
  constructor (skip, take, sink, disposable) {
    super(sink)
    this.skip = skip
    this.take = take
    this.disposable = disposable
  }

  event (t, x) {
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

export const takeWhile = (p, stream) =>
  isCanonicalEmpty(stream) ? empty()
    : new TakeWhile(p, stream)

class TakeWhile {
  constructor (p, source) {
    this.p = p
    this.source = source
  }

  run (sink, scheduler) {
    const disposable = new SettableDisposable()
    const takeWhileSink = new TakeWhileSink(this.p, sink, disposable)

    disposable.setDisposable(this.source.run(takeWhileSink, scheduler))

    return disposable
  }
}

class TakeWhileSink extends Pipe {
  constructor (p, sink, disposable) {
    super(sink)
    this.p = p
    this.active = true
    this.disposable = disposable
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
      this.disposable.dispose()
      this.sink.end(t)
    }
  }
}

export const skipWhile = (p, stream) =>
  isCanonicalEmpty(stream) ? empty()
    : new SkipWhile(p, stream)

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

export const skipAfter = (p, stream) =>
  isCanonicalEmpty(stream) ? empty()
    : new SkipAfter(p, stream)

class SkipAfter {
  constructor (p, source) {
    this.p = p
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new SkipAfterSink(this.p, sink), scheduler)
  }
}

class SkipAfterSink extends Pipe {
  constructor (p, sink) {
    super(sink)
    this.p = p
    this.skipping = false
  }

  event (t, x) {
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
