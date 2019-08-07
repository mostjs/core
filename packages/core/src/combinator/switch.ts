/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { disposeBoth, tryDispose } from '@most/disposable'
import { schedulerRelativeTo, currentTime } from '@most/scheduler'
import { empty, isCanonicalEmpty } from '../source/empty'
import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types' // eslint-disable-line no-unused-vars

/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @param stream of streams on which to switch
 * @returns switching stream
 */
export const switchLatest = <A>(stream: Stream<Stream<A>>): Stream<A> =>
  isCanonicalEmpty(stream)
    ? empty()
    : new Switch(stream)

class Switch<A> {
  private readonly source: Stream<Stream<A>>

  constructor (source: Stream<Stream<A>>) {
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    const switchSink = new SwitchSink(sink, scheduler)
    return disposeBoth(switchSink, this.source.run(switchSink, scheduler))
  }
}

class SwitchSink<A> {
  private readonly sink: Sink<A>
  private readonly scheduler: Scheduler
  private ended: boolean
  private current: Segment<A> | null

  constructor (sink: Sink<A>, scheduler: Scheduler) {
    this.sink = sink
    this.scheduler = scheduler
    this.current = null
    this.ended = false
  }

  event (t: Time, stream: Stream<A>): void {
    this._disposeCurrent(t)
    this.current = new Segment(stream, t, Infinity, this, this.sink, this.scheduler)
  }

  end (t: Time): void {
    this.ended = true
    this._checkEnd(t)
  }

  error (t: Time, e: Error): void {
    this.ended = true
    this.sink.error(t, e)
  }

  dispose (): void {
    return this._disposeCurrent(currentTime(this.scheduler))
  }

  _disposeCurrent (t: Time): void {
    if (this.current !== null) {
      return this.current._dispose(t)
    }
  }

  _disposeInner (t: Time, inner: Segment<A>) {
    inner._dispose(t)
    if (inner === this.current) {
      this.current = null
    }
  }

  _checkEnd (t: Time) {
    if (this.ended && this.current === null) {
      this.sink.end(t)
    }
  }

  _endInner (t: Time, inner: Segment<A>) {
    this._disposeInner(t, inner)
    this._checkEnd(t)
  }

  _errorInner (t: Time, e: Error, inner: Segment<A>) {
    this._disposeInner(t, inner)
    this.sink.error(t, e)
  }
}

class Segment<A> {
  private readonly min: Time
  private readonly max: Time
  private readonly outer: SwitchSink<A>
  private readonly sink: Sink<A>
  private disposable: Disposable

  constructor (source: Stream<A>, min: Time, max: Time, outer: SwitchSink<A>, sink: Sink<A>, scheduler: Scheduler) {
    this.min = min
    this.max = max
    this.outer = outer
    this.sink = sink
    this.disposable = source.run(this, schedulerRelativeTo(min, scheduler))
  }

  event (t: Time, x: A): void {
    const time = Math.max(0, t + this.min)
    if (time < this.max) {
      this.sink.event(time, x)
    }
  }

  end (t: Time): void {
    this.outer._endInner(t + this.min, this)
  }

  error (t: Time, e: Error): void {
    this.outer._errorInner(t + this.min, e, this)
  }

  _dispose (t: Time): void {
    tryDispose(t, this.disposable, this.sink)
  }
}
