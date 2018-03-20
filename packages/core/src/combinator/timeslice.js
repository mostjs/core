/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeAll } from '@most/disposable'
import { join } from './chain'
import { skip, take } from './slice'
import { mergeArray } from './merge'

// Time bounds
// TODO: Move to own module
const timeBounds = (minSignals, maxSignals) =>
  ({ minSignals, maxSignals })

const minBounds = minSignal =>
  timeBounds([minSignal], [])

const maxBounds = maxSignal =>
  timeBounds([], [maxSignal])

const mergeTimeBounds = (b1, b2) =>
  timeBounds(
    b1.minSignals.concat(b2.minSignals),
    b1.maxSignals.concat(b2.maxSignals)
  )

// Interpret time bounds
const getStartingMin = ({ minSignals }) =>
  minSignals.length === 0 ? Infinity : 0

const getMinSignal = ({ minSignals }) =>
  skip(minSignals.length - 1, mergeArray(minSignals.map(first)))

const getMaxSignal = ({ maxSignals }) =>
  mergeArray(maxSignals)

const first = stream =>
  take(1, stream)

export const until = (signal, stream) =>
  timeslice(maxBounds(signal), stream)

export const since = (signal, stream) =>
  timeslice(minBounds(signal), stream)

export const during = (timeWindow, stream) =>
  until(join(timeWindow), since(timeWindow, stream))

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
    const ts = new TimesliceSink(getStartingMin(this.bounds), sink)

    const dmin = getMinSignal(this.bounds).run(new UpdateMinSink(ts), scheduler)
    const dmax = getMaxSignal(this.bounds).run(new UpdateMaxSink(ts), scheduler)
    const d = this.source.run(ts, scheduler)

    return disposeAll([dmin, dmax, d])
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
    if (t < this.min) {
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
