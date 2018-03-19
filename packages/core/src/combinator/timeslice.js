/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'
import { join } from './chain'
import { merge } from './merge'
import { never } from '../source/never'

const timeBounds = (min, minSignal, maxSignal) =>
  ({ min, minSignal, maxSignal })

const minBounds = (minSignal) =>
  timeBounds(Infinity, minSignal, never())

const maxBounds = (maxSignal) =>
  timeBounds(0, never(), maxSignal)

const mergeTimeBounds = (b1, b2) =>
  ({
    min: Math.max(b1.min, b2.min),
    minSignal: merge(b1.minSignal, b2.minSignal),
    maxSignal: merge(b1.maxSignal, b2.maxSignal)
  })

const runTimeBounds = (bounds, timesliceSink, scheduler) =>
  disposeBoth(
    bounds.minSignal.run(new UpdateMinSink(timesliceSink), scheduler),
    bounds.maxSignal.run(new UpdateMaxSink(timesliceSink), scheduler)
  )

export const until = (signal, stream) =>
  timeslice(maxBounds(signal), stream)

export const since = (signal, stream) =>
  timeslice(minBounds(signal), stream)

export const during = (timeWindow, stream) =>
  since(timeWindow, until(join(timeWindow), stream))

const timeslice = (bounds, stream) =>
  stream instanceof Timeslice
    ? timeslice(mergeTimeBounds(bounds, stream.bounds), stream.source)
    : new Timeslice(bounds, stream)

class Timeslice {
  constructor (bounds, source) {
    this.bounds = bounds
    this.source = source
  }

  run (sink, scheduler) {
    const ts = new TimesliceSink(this.bounds.min, sink)

    const boundsDisposable = runTimeBounds(this.bounds, ts, scheduler)
    const d = this.source.run(ts, scheduler)

    return disposeBoth(boundsDisposable, d)
  }
}

class TimesliceSink extends Pipe {
  constructor (min, sink) {
    super(sink)
    this.min = min
    this.max = Infinity
  }

  event (t, x) {
    if (t >= this.min && t < this.max) {
      this.sink.event(t, x)
    }
  }

  _updateMin (t) {
    if (this.min === Infinity) {
      this.min = t
    }
  }

  _updateMax (t) {
    if (t < this.max) {
      this.max = t
      this.sink.end(t)
    }
  }
}

class UpdateMinSink extends Pipe {
  event (t, x) {
    this.sink._updateMin(t)
  }

  end () {}
}

class UpdateMaxSink extends Pipe {
  event (t, x) {
    this.sink._updateMax(t)
  }

  end () {}
}
