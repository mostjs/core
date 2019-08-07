/** @license MIT License (c) copyright 2010 original author or authors */

import { disposeAll, disposeNone, disposeOnce, tryDispose } from '@most/disposable'
import { empty, isCanonicalEmpty } from '../source/empty'
import { id as identity } from '@most/prelude'
import { schedulerRelativeTo } from '@most/scheduler'
import { Time, Disposable, Sink, Scheduler, Stream } from '@most/types' // eslint-disable-line no-unused-vars

export const mergeConcurrently = <A>(concurrency: number, stream: Stream<Stream<A>>): Stream<A> =>
  mergeMapConcurrently(identity, concurrency, stream)

export const mergeMapConcurrently = <A, B>(f: (a: A) => Stream<B>, concurrency: number, stream: Stream<A>): Stream<B> =>
  isCanonicalEmpty(stream) ? empty()
    : new MergeConcurrently(f, concurrency, stream)

class MergeConcurrently<A, B> {
  private readonly concurrency: number;
  private readonly f: (a: A) => Stream<B>
  private readonly source: Stream<A>

  constructor (f: (a: A) => Stream<B>, concurrency: number, source: Stream<A>) {
    this.f = f
    this.concurrency = concurrency
    this.source = source
  }

  run (sink: Sink<B>, scheduler: Scheduler) {
    return new Outer(this.f, this.concurrency, this.source, sink, scheduler)
  }
}

class Outer<A, B> {
  private readonly scheduler: Scheduler;
  private readonly disposable: Disposable;
  private active: boolean;
  private readonly concurrency: number;
  private readonly f: (a: A) => Stream<B>;
  private readonly sink: Sink<B>;
  private readonly current: Disposable[];
  private readonly pending: A[];

  constructor (f: (a: A) => Stream<B>, concurrency: number, source: Stream<A>, sink: Sink<B>, scheduler: Scheduler) {
    this.f = f
    this.concurrency = concurrency
    this.sink = sink
    this.scheduler = scheduler
    this.pending = []
    this.current = []
    this.disposable = disposeOnce(source.run(this, scheduler))
    this.active = true
  }

  event (t: Time, x: A): void {
    this._addInner(t, x)
  }

  _addInner (t: Time, x: A): void {
    if (this.current.length < this.concurrency) {
      this._startInner(t, x)
    } else {
      this.pending.push(x)
    }
  }

  _startInner (t: Time, x: A): void {
    try {
      this._initInner(t, x)
    } catch (e) {
      this.error(t, e)
    }
  }

  _initInner (t: Time, x: A): void {
    const innerSink = new Inner(t, this, this.sink)
    innerSink.disposable = mapAndRun(this.f, t, x, innerSink, this.scheduler)
    this.current.push(innerSink)
  }

  end (t: Time) {
    this.active = false
    tryDispose(t, this.disposable, this.sink)
    this._checkEnd(t)
  }

  error (t: Time, e: Error) {
    this.active = false
    this.sink.error(t, e)
  }

  dispose () {
    this.active = false
    this.pending.length = 0
    this.disposable.dispose()
    disposeAll(this.current).dispose()
  }

  _endInner (t: Time, inner: Disposable) {
    const i = this.current.indexOf(inner)
    if (i >= 0) {
      this.current.splice(i, 1)
    }
    tryDispose(t, inner, this)

    if (this.pending.length === 0) {
      this._checkEnd(t)
    } else {
      this._startInner(t, this.pending.shift() as A)
    }
  }

  _checkEnd (t: Time) {
    if (!this.active && this.current.length === 0) {
      this.sink.end(t)
    }
  }
}

const mapAndRun = <A, B>(f: (a: A) => Stream<B>, t: Time, x: A, sink: Sink<B>, scheduler: Scheduler): Disposable =>
  f(x).run(sink, schedulerRelativeTo(t, scheduler))

class Inner<A, B> {
  private readonly time: number;
  private readonly outer: Outer<A, B>;
  disposable: Disposable;
  private readonly sink: Sink<B>;

  constructor (time: Time, outer: Outer<A, B>, sink: Sink<B>) {
    this.time = time
    this.outer = outer
    this.sink = sink
    this.disposable = disposeNone()
  }

  event (t: Time, x: B) {
    this.sink.event(t + this.time, x)
  }

  end (t: Time) {
    this.outer._endInner(t + this.time, this)
  }

  error (t: Time, e: Error) {
    this.outer.error(t + this.time, e)
  }

  dispose () {
    return this.disposable.dispose()
  }
}
