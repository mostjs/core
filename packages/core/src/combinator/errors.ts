/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import SafeSink from '../sink/SafeSink'
import { tryDispose } from '@most/disposable'
import { asap } from '@most/scheduler'
import { tryEvent, tryEnd } from '../source/tryEvent'
import { empty, isCanonicalEmpty } from '../source/empty'
import { propagateErrorTask } from '../scheduler/PropagateTask'
import { run } from '../run'
import { withLocalTime } from './withLocalTime'
import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types'

/**
 * If stream encounters an error, recover and continue with items from stream
 * returned by f.
 * @param f which returns a new stream
 * @param stream
 * @returns new stream which will recover from an error by calling f
 */
export const recoverWith = <A, E extends Error>(f: (error: E) => Stream<A>, stream: Stream<A>): Stream<A> =>
  isCanonicalEmpty(stream) ? empty()
    : new RecoverWith(f, stream)

/**
 * Create a stream containing only an error
 * @param e error value, preferably an Error or Error subtype
 * @returns new stream containing only an error
 */
export const throwError = (e: Error): Stream<never> =>
  new ErrorStream(e)

class ErrorStream implements Stream<never> {
  private readonly value: Error;

  constructor (e: Error) {
    this.value = e
  }

  run (sink: Sink<never>, scheduler: Scheduler): Disposable {
    return asap(propagateErrorTask(this.value, sink), scheduler)
  }
}

class RecoverWith<A, E extends Error> implements Stream<A> {
  private readonly f: (error: E) => Stream<A>;
  private readonly source: Stream<A>;

  constructor (f: (error: E) => Stream<A>, source: Stream<A>) {
    this.f = f
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return new RecoverWithSink(this.f, this.source, sink, scheduler)
  }
}

class RecoverWithSink<A, E extends Error> implements Sink<A>, Disposable {
  private readonly f: (error: E) => Stream<A>
  private readonly sink: SafeSink<A>
  private readonly scheduler: Scheduler
  private disposable: Disposable

  constructor (f: (error: E) => Stream<A>, source: Stream<A>, sink: Sink<A>, scheduler: Scheduler) {
    this.f = f
    this.sink = new SafeSink(sink)
    this.scheduler = scheduler
    this.disposable = source.run(this, scheduler)
  }

  event (t: Time, x: A): void {
    tryEvent(t, x, this.sink)
  }

  end (t: Time): void {
    tryEnd(t, this.sink)
  }

  error (t: Time, e: E): void {
    const nextSink = this.sink.disable()

    tryDispose(t, this.disposable, this.sink)

    this._startNext(t, e, nextSink)
  }

  private _startNext (t: Time, x: E, sink: Sink<A>): void {
    try {
      this.disposable = this._continue(this.f, t, x, sink)
    } catch (e) {
      sink.error(t, e)
    }
  }

  private _continue (f: (error: E) => Stream<A>, t: Time, x: E, sink: Sink<A>): Disposable {
    return run(sink, this.scheduler, withLocalTime(t, f(x)))
  }

  dispose (): void {
    return this.disposable.dispose()
  }
}
