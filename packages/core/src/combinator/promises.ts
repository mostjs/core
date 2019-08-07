/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import fatal from '../fatalError'
import { now } from '../source/now'
import { empty, isCanonicalEmpty } from '../source/empty'
import { currentTime } from '@most/scheduler'
import { Stream, Sink, Scheduler, Time } from '@most/types' // eslint-disable-line no-unused-vars

/**
 * Turn a Stream<Promise<T>> into Stream<T> by awaiting each promise.
 * Event order is preserved. The stream will fail if any promise rejects.
 */
export const awaitPromises = <A>(stream: Stream<Promise<A>>): Stream<A> =>
  isCanonicalEmpty(stream) ? empty() : new Await(stream)

/**
 * Create a stream containing only the promise's fulfillment
 * value at the time it fulfills.
 * @param p promise
 * @return stream containing promise's fulfillment value.
 *  If the promise rejects, the stream will error
 */
export const fromPromise = <A>(promise: Promise<A>): Stream<A> => awaitPromises(now(promise))

class Await<A> {
  private readonly source: Stream<Promise<A>>

  constructor (source: Stream<Promise<A>>) {
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler) {
    return this.source.run(new AwaitSink(sink, scheduler), scheduler)
  }
}

class AwaitSink<A> {
  private readonly sink: Sink<A>;
  private readonly scheduler: Scheduler;
  private queue: Promise<unknown>;

  constructor (sink: Sink<A>, scheduler: Scheduler) {
    this.sink = sink
    this.scheduler = scheduler
    this.queue = Promise.resolve()
  }

  event (_t: Time, promise: Promise<A>): void {
    this.queue = this.queue.then(() => this._event(promise))
      .catch(this._errorBound)
  }

  end (_t: Time): void {
    this.queue = this.queue.then(this._endBound)
      .catch(this._errorBound)
  }

  error (_t: Time, e: Error): void {
    // Don't resolve error values, propagate directly
    this.queue = this.queue.then(() => this._errorBound(e))
      .catch(fatal)
  }

  _event (promise: Promise<A>): Promise<void> {
    return promise.then(this._eventBound)
  }

  // Pre-create closures, to avoid creating them per event
  private _eventBound = (x: A): void => this.sink.event(currentTime(this.scheduler), x)
  private _endBound = (): void => this.sink.end(currentTime(this.scheduler))
  private _errorBound = (e: Error): void => this.sink.error(currentTime(this.scheduler), e)
}
