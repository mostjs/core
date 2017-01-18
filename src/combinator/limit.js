/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Stream from '../Stream'
import Pipe from '../sink/Pipe'
import * as dispose from '../disposable/dispose'
import { propagateEvent } from '../scheduler/PropagateTask'
import Map from '../fusion/Map'

/**
 * Limit the rate of events by suppressing events that occur too often
 * @param {Number} period time to suppress events
 * @param {Stream} stream
 * @returns {Stream}
 */
export const throttle = (period, stream) =>
  new Stream(throttleSource(period, stream.source))

const throttleSource = (period, source) =>
  source instanceof Map ? commuteMapThrottle(period, source)
    : source instanceof Throttle ? fuseThrottle(period, source)
    : new Throttle(period, source)

const commuteMapThrottle = (period, source) =>
  Map.create(source.f, throttleSource(period, source.source))

const fuseThrottle = (period, source) =>
  new Throttle(Math.max(period, source.period), source.source)

class Throttle {
  constructor (period, source) {
    this.period = period
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new ThrottleSink(this.period, sink), scheduler)
  }
}

class ThrottleSink extends Pipe {
  constructor (period, sink) {
    super(sink)
    this.time = 0
    this.period = period
  }

  event (t, x) {
    if (t >= this.time) {
      this.time = t + this.period
      this.sink.event(t, x)
    }
  }
}
/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * @param {Number} period events occuring more frequently than this
 *  will be suppressed
 * @param {Stream} stream stream to debounce
 * @returns {Stream} new debounced stream
 */
export const debounce = (period, stream) =>
  new Stream(new Debounce(period, stream.source))

class Debounce {
  constructor (dt, source) {
    this.dt = dt
    this.source = source
  }

  run (sink, scheduler) {
    return new DebounceSink(this.dt, this.source, sink, scheduler)
  }
}

class DebounceSink {
  constructor (dt, source, sink, scheduler) {
    this.dt = dt
    this.sink = sink
    this.scheduler = scheduler
    this.value = void 0
    this.timer = null

    const sourceDisposable = source.run(this, scheduler)
    this.disposable = dispose.all([this, sourceDisposable])
  }

  event (t, x) {
    this._clearTimer()
    this.value = x
    this.timer = this.scheduler.delay(this.dt, propagateEvent(x, this.sink))
  }

  end (t, x) {
    if (this._clearTimer()) {
      this.sink.event(t, this.value)
      this.value = void 0
    }
    this.sink.end(t, x)
  }

  error (t, x) {
    this._clearTimer()
    this.sink.error(t, x)
  }

  dispose () {
    this._clearTimer()
  }

  _clearTimer () {
    if (this.timer === null) {
      return false
    }
    this.timer.dispose()
    this.timer = null
    return true
  }
}

