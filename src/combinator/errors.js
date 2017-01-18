/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Stream from '../Stream'
import SafeSink from '../sink/SafeSink'
import * as dispose from '../disposable/dispose'
import * as tryEvent from '../source/tryEvent'
import { propagateError } from '../scheduler/PropagateTask'

/**
 * If stream encounters an error, recover and continue with items from stream
 * returned by f.
 * @param {function(error:*):Stream} f function which returns a new stream
 * @param {Stream} stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
export const recoverWith = (f, stream) =>
  new Stream(new RecoverWith(f, stream.source))

/**
 * Create a stream containing only an error
 * @param {*} e error value, preferably an Error or Error subtype
 * @returns {Stream} new stream containing only an error
 */
export const throwError = e =>
  new Stream(new ErrorSource(e))

class ErrorSource {
  constructor (e) {
    this.value = e
  }

  run (sink, scheduler) {
    return scheduler.asap(propagateError(this.value, sink))
  }
}

class RecoverWith {
  constructor (f, source) {
    this.f = f
    this.source = source
  }

  run (sink, scheduler) {
    return new RecoverWithSink(this.f, this.source, sink, scheduler)
  }
}

class RecoverWithSink {
  constructor (f, source, sink, scheduler) {
    this.f = f
    this.sink = new SafeSink(sink)
    this.scheduler = scheduler
    this.disposable = source.run(this, scheduler)
  }

  event (t, x) {
    tryEvent.tryEvent(t, x, this.sink)
  }

  end (t, x) {
    tryEvent.tryEnd(t, x, this.sink)
  }

  error (t, e) {
    const nextSink = this.sink.disable()

    dispose.tryDispose(t, this.disposable, this.sink)
    this._startNext(t, e, nextSink)
  }

  _startNext (t, x, sink) {
    try {
      this.disposable = this._continue(this.f, x, sink)
    } catch (e) {
      sink.error(t, e)
    }
  }

  _continue (f, x, sink) {
    const stream = f(x)
    return stream.source.run(sink, this.scheduler)
  }

  dispose () {
    return this.disposable.dispose()
  }
}

