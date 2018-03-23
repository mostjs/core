/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeAll } from '@most/disposable'
import { map } from '@most/prelude'
import { empty, isCanonicalEmpty } from '../source/empty'
import { join } from './chain'
import { take } from './slice'
import { mergeArray } from './merge'

// Time bounds
// TODO: Move to own module
const timeBounds = (min, max) =>
  ({ min, max })

const minBounds = min =>
  timeBounds([min], [])

const maxBounds = max =>
  timeBounds([], [max])

const mergeTimeBounds = (b1, b2) =>
  timeBounds(b1.min.concat(b2.min), b1.max.concat(b2.max))

// Interpret time bounds
const getStartingMin = ({ min }) =>
  min.length === 0 ? 0 : Infinity

const getSignals = ({ min, max }) =>
  ({ min: last(mergeArray(map(first, min))), max: first(mergeArray(max)) })

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
    const { min, max } = getSignals(this.bounds)

    const dmin = min.run(new UpdateMinSink(ts), scheduler)
    const dmax = max.run(new UpdateMaxSink(ts), scheduler)
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
