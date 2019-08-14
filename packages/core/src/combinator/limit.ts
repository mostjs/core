/** @license MIT License (c) copyright 2010-2017 original author or authors */

import Pipe from '../sink/Pipe'
import Map from '../fusion/Map'
import { empty, isCanonicalEmpty } from '../source/empty'
import { delay } from '@most/scheduler'
import { Stream, Time, Sink, Scheduler, Disposable, ScheduledTask, Task } from '@most/types'

/**
 * Limit the rate of events by suppressing events that occur too often
 * @param period time to suppress events
 * @param stream
 */
export const throttle = <A>(period: number, stream: Stream<A>): Stream<A> =>
  isCanonicalEmpty(stream) ? empty()
    : stream instanceof Map ? commuteMapThrottle(period, stream)
      : stream instanceof Throttle ? fuseThrottle(period, stream)
        : new Throttle(period, stream)

const commuteMapThrottle = <A, B>(period: number, mapStream: Map<A, B>): Stream<B> =>
  Map.create(mapStream.f, throttle(period, mapStream.source))

const fuseThrottle = <A>(period: number, throttleStream: Throttle<A>): Stream<A> =>
  new Throttle(Math.max(period, throttleStream.period), throttleStream.source)

export class Throttle<A> implements Stream<A> {
  readonly period: number;
  readonly source: Stream<A>;

  constructor (period: number, source: Stream<A>) {
    this.period = period
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(new ThrottleSink(this.period, sink), scheduler)
  }
}

class ThrottleSink<A> extends Pipe<A> {
  private time: Time
  private readonly period: number;

  constructor (period: number, sink: Sink<A>) {
    super(sink)
    this.time = 0
    this.period = period
  }

  event (t: Time, x: A): void {
    if (t >= this.time) {
      this.time = t + this.period
      this.sink.event(t, x)
    }
  }
}
/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * @param period events occuring more frequently than this will be suppressed
 * @param stream stream to debounce
 * @returns new debounced stream
 */
export const debounce = <A>(period: number, stream: Stream<A>): Stream<A> =>
  isCanonicalEmpty(stream) ? empty()
    : new Debounce(period, stream)

class Debounce<A> implements Stream<A> {
  private readonly dt: number;
  private readonly source: Stream<A>

  constructor (dt: number, source: Stream<A>) {
    this.dt = dt
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return new DebounceSink(this.dt, this.source, sink, scheduler)
  }
}

class DebounceSink<A> implements Sink<A>, Disposable {
  private readonly dt: number;
  private readonly sink: Sink<A>;
  private readonly scheduler: Scheduler
  private value: A | undefined;
  private timer: ScheduledTask | null
  private disposable: Disposable

  constructor (dt: number, source: Stream<A>, sink: Sink<A>, scheduler: Scheduler) {
    this.dt = dt
    this.sink = sink
    this.scheduler = scheduler
    this.value = void 0
    this.timer = null

    this.disposable = source.run(this, scheduler)
  }

  event (_t: Time, x: A): void {
    this._clearTimer()
    this.value = x
    this.timer = delay(this.dt, new DebounceTask(this, x), this.scheduler)
  }

  _event (t: Time, x: A): void {
    this._clearTimer()
    this.sink.event(t, x)
  }

  end (t: Time): void {
    if (this._clearTimer()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.sink.event(t, this.value!)
      this.value = undefined
    }
    this.sink.end(t)
  }

  error (t: Time, x: Error): void {
    this._clearTimer()
    this.sink.error(t, x)
  }

  dispose (): void {
    this._clearTimer()
    this.disposable.dispose()
  }

  private _clearTimer (): boolean {
    if (this.timer === null) {
      return false
    }
    this.timer.dispose()
    this.timer = null
    return true
  }
}

class DebounceTask<A> implements Task {
  private readonly debounce: DebounceSink<A>;
  private readonly value: A;

  constructor (debounce: DebounceSink<A>, value: A) {
    this.debounce = debounce
    this.value = value
  }

  run (t: Time): void {
    this.debounce._event(t, this.value)
  }

  error (t: Time, e: Error): void {
    this.debounce.error(t, e)
  }

  dispose (): void {}
}
