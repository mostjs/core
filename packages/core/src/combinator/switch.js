/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { disposeBoth, tryDispose } from '@most/disposable'
import { schedulerRelativeTo, currentTime } from '@most/scheduler'

/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @param {Stream} stream of streams on which to switch
 * @returns {Stream} switching stream
 */
export const switchLatest = stream => new Switch(stream)

class Switch {
  constructor (source) {
    this.source = source
  }

  run (sink, scheduler) {
    const switchSink = new SwitchSink(sink, scheduler)
    return disposeBoth(switchSink, this.source.run(switchSink, scheduler))
  }
}

class SwitchSink {
  constructor (sink, scheduler) {
    this.sink = sink
    this.scheduler = scheduler
    this.current = null
    this.ended = false
  }

  event (t, stream) {
    this._disposeCurrent(t)
    this.current = new Segment(stream, t, Infinity, this, this.sink, this.scheduler)
  }

  end (t) {
    this.ended = true
    this._checkEnd(t)
  }

  error (t, e) {
    this.ended = true
    this.sink.error(t, e)
  }

  dispose () {
    return this._disposeCurrent(currentTime(this.scheduler))
  }

  _disposeCurrent (t) {
    if (this.current !== null) {
      return this.current._dispose(t)
    }
  }

  _disposeInner (t, inner) {
    inner._dispose(t)
    if (inner === this.current) {
      this.current = null
    }
  }

  _checkEnd (t) {
    if (this.ended && this.current === null) {
      this.sink.end(t)
    }
  }

  _endInner (t, inner) {
    this._disposeInner(t, inner)
    this._checkEnd(t)
  }

  _errorInner (t, e, inner) {
    this._disposeInner(t, inner)
    this.sink.error(t, e)
  }
}

class Segment {
  constructor (source, min, max, outer, sink, scheduler) {
    this.min = min
    this.max = max
    this.outer = outer
    this.sink = sink
    this.disposable = source.run(this, schedulerRelativeTo(min, scheduler))
  }

  event (t, x) {
    const time = Math.max(0, t + this.min)
    if (time < this.max) {
      this.sink.event(time, x)
    }
  }

  end (t) {
    this.outer._endInner(t + this.min, this)
  }

  error (t, e) {
    this.outer._errorInner(t + this.min, e, this)
  }

  _dispose (t) {
    return tryDispose(t + this.min, this.disposable, this.sink)
  }
}
