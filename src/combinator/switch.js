/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Stream from '../Stream'
import * as dispose from '../disposable/dispose'

/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @param {Stream} stream of streams on which to switch
 * @returns {Stream} switching stream
 */
export const switchLatest = stream => new Stream(new Switch(stream.source))

class Switch {
  constructor (source) {
    this.source = source
  }

  run (sink, scheduler) {
    const switchSink = new SwitchSink(sink, scheduler)
    return dispose.all([switchSink, this.source.run(switchSink, scheduler)])
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
    this._disposeCurrent(t) // TODO: capture the result of this dispose
    this.current = new Segment(t, Infinity, this, this.sink)
    this.current.disposable = stream.source.run(this.current, this.scheduler)
  }

  end (t, x) {
    this.ended = true
    this._checkEnd(t, x)
  }

  error (t, e) {
    this.ended = true
    this.sink.error(t, e)
  }

  dispose () {
    return this._disposeCurrent(this.scheduler.now())
  }

  _disposeCurrent (t) {
    if (this.current !== null) {
      return this.current._dispose(t)
    }
  }

  _disposeInner (t, inner) {
    inner._dispose(t) // TODO: capture the result of this dispose
    if (inner === this.current) {
      this.current = null
    }
  }

  _checkEnd (t, x) {
    if (this.ended && this.current === null) {
      this.sink.end(t, x)
    }
  }

  _endInner (t, x, inner) {
    this._disposeInner(t, inner)
    this._checkEnd(t, x)
  }

  _errorInner (t, e, inner) {
    this._disposeInner(t, inner)
    this.sink.error(t, e)
  }
}

class Segment {
  constructor (min, max, outer, sink) {
    this.min = min
    this.max = max
    this.outer = outer
    this.sink = sink
    this.disposable = dispose.empty()
  }

  event (t, x) {
    if (t < this.max) {
      this.sink.event(Math.max(t, this.min), x)
    }
  }

  end (t, x) {
    this.outer._endInner(Math.max(t, this.min), x, this)
  }

  error (t, e) {
    this.outer._errorInner(Math.max(t, this.min), e, this)
  }

  _dispose (t) {
    this.max = t
    dispose.tryDispose(t, this.disposable, this.sink)
  }
}

