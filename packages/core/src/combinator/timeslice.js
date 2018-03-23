/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeAll } from '@most/disposable'
import { empty, isCanonicalEmpty } from '../source/empty'
import { join } from './chain'
import { take } from './slice'
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
  minSignals.length === 0 ? 0 : Infinity

const getMinSignal = ({ minSignals }) =>
  last(mergeArray(minSignals.map(first)))

const getMaxSignal = ({ maxSignals }) =>
  mergeArray(maxSignals)

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

  end (t) {
    if (t < this.max) {
      this.max = t
      this.sink.end(t)
    }
  }
}

class UpdateMinSink extends Pipe {
  event (t, x) {
    this.sink.min = Math.min(this.sink.min, t)
  }

  end () {}
}

class UpdateMaxSink extends Pipe {
  event (t, x) {
    this.sink.end(t)
  }

  end () {}
}

const first = stream =>
  take(1, stream)

const last = stream =>
  isCanonicalEmpty(stream) ? empty()
    : new Last(stream)

class Last {
  constructor (source) {
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new LastSink(sink), scheduler)
  }
}

class LastSink extends Pipe {
  constructor (sink) {
    super(sink)
    this.has = false
    this.value = undefined
  }

  event (t, x) {
    this.has = true
    this.value = x
  }

  end (t) {
    if (this.has) {
      this.sink.event(t, this.value)
    }
    this.sink.end(t)
  }
}
