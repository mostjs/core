/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import fatal from '../fatalError'
import { now } from '../source/now'
import { compose } from '@most/prelude'
import { currentTime } from '@most/scheduler'

/**
 * Turn a Stream<Promise<T>> into Stream<T> by awaiting each promise.
 * Event order is preserved. The stream will fail if any promise rejects.
 */
export const awaitPromises = stream => new Await(stream)

/**
 * Create a stream containing only the promise's fulfillment
 * value at the time it fulfills.
 * @param {Promise<T>} p promise
 * @return {Stream<T>} stream containing promise's fulfillment value.
 *  If the promise rejects, the stream will error
 */
export const fromPromise = compose(awaitPromises, now)

class Await {
  constructor (source) {
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new AwaitSink(sink, scheduler), scheduler)
  }
}

class AwaitSink {
  constructor (sink, scheduler) {
    this.sink = sink
    this.scheduler = scheduler
    this.queue = Promise.resolve()

    // Pre-create closures, to avoid creating them per event
    this._eventBound = x => this.sink.event(currentTime(this.scheduler), x)
    this._endBound = () => this.sink.end(currentTime(this.scheduler))
    this._errorBound = e => this.sink.error(currentTime(this.scheduler), e)
  }

  event (t, promise) {
    this.queue = this.queue.then(() => this._event(promise))
      .catch(this._errorBound)
  }

  end (t) {
    this.queue = this.queue.then(this._endBound)
      .catch(this._errorBound)
  }

  error (t, e) {
    // Don't resolve error values, propagate directly
    this.queue = this.queue.then(() => this._errorBound(e))
      .catch(fatal)
  }

  _event (promise) {
    return promise.then(this._eventBound)
  }
}
