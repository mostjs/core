/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import SafeSink from '../sink/SafeSink'
import { tryDispose } from '@most/disposable'
import { tryEvent, tryEnd } from '../source/tryEvent'
import { propagateErrorTask } from '../scheduler/PropagateTask'
import { runWithLocalTime } from '../scheduler/runWithLocalTime'

/**
 * If stream encounters an error, recover and continue with items from stream
 * returned by f.
 * @param {function(error:*):Stream} f function which returns a new stream
 * @param {Stream} stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
export const recoverWith = (f, stream) =>
  new RecoverWith(f, stream)

/**
 * Create a stream containing only an error
 * @param {*} e error value, preferably an Error or Error subtype
 * @returns {Stream} new stream containing only an error
 */
export const throwError = e =>
  new ErrorStream(e)

class ErrorStream {
  constructor (e) {
    this.value = e
  }

  run (sink, scheduler) {
    return scheduler.asap(propagateErrorTask(this.value, sink))
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
    tryEvent(t, x, this.sink)
  }

  end (t) {
    tryEnd(t, this.sink)
  }

  error (t, e) {
    const nextSink = this.sink.disable()

    tryDispose(t, this.disposable, this.sink)

    this._startNext(t, e, nextSink)
  }

  _startNext (t, x, sink) {
    try {
      this.disposable = this._continue(this.f, t, x, sink)
    } catch (e) {
      sink.error(t, e)
    }
  }

  _continue (f, t, x, sink) {
    return runWithLocalTime(t, f(x), sink, this.scheduler)
  }

  dispose () {
    return this.disposable.dispose()
  }
}
