/** @license MIT License (c) copyright 2010-2017 original author or authors */

import Pipe from '../sink/Pipe'
import { propagateEventTask } from '../scheduler/PropagateTask'
import Map from '../fusion/Map'

/**
 * Limit the rate of events by suppressing events that occur too often
 * @param {Number} period time to suppress events
 * @param {Stream} stream
 * @returns {Stream}
 */
export const throttle = (period, stream) =>
  stream instanceof Map ? commuteMapThrottle(period, stream)
    : stream instanceof Throttle ? fuseThrottle(period, stream)
    : new Throttle(period, stream)

const commuteMapThrottle = (period, mapStream) =>
  Map.create(mapStream.f, throttle(period, mapStream.source))

const fuseThrottle = (period, throttleStream) =>
  new Throttle(Math.max(period, throttleStream.period), throttleStream.source)

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
  new Debounce(period, stream)

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

    this.disposable = source.run(this, scheduler)
  }

  event (t, x) {
    this._clearTimer()
    this.value = x
    this.timer = this.scheduler.delay(this.dt, propagateEventTask(x, this.sink))
  }

  end (t) {
    if (this._clearTimer()) {
      this.sink.event(t, this.value)
      this.value = undefined
    }
    this.sink.end(t)
  }

  error (t, x) {
    this._clearTimer()
    this.sink.error(t, x)
  }

  dispose () {
    this._clearTimer()
    this.disposable.dispose()
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
