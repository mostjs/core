/** @license MIT License (c) copyright 2010 original author or authors */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'
import { empty, isCanonicalEmpty } from '../source/empty'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types'

export const sample = <A, B>(values: Stream<A>, sampler: Stream<B>): Stream<A> =>
  snapshot(x => x, values, sampler)

export const snapshot = <A, B, C>(f: (a: A, b: B) => C, values: Stream<A>, sampler: Stream<B>): Stream<C> =>
  isCanonicalEmpty(sampler) || isCanonicalEmpty(values)
    ? empty()
    : new Snapshot(f, values, sampler)

export class Snapshot<A, B, C> implements Stream<C> {
  private readonly f: (a: A, b: B) => C
  private readonly values: Stream<A>
  private readonly sampler: Stream<B>

  constructor (f: (a: A, b: B) => C, values: Stream<A>, sampler: Stream<B>) {
    this.f = f
    this.values = values
    this.sampler = sampler
  }

  run (sink: Sink<C>, scheduler: Scheduler): Disposable {
    const sampleSink = new SnapshotSink(this.f, sink)
    const valuesDisposable = this.values.run(sampleSink.latest, scheduler)
    const samplerDisposable = this.sampler.run(sampleSink, scheduler)

    return disposeBoth(samplerDisposable, valuesDisposable)
  }
}

export class SnapshotSink<A, B, C> extends Pipe<B, C> implements Sink<B> {
  private readonly f: (a: A, b: B) => C
  readonly latest: LatestValueSink<A>;

  constructor (f: (a: A, b: B) => C, sink: Sink<C>) {
    super(sink)
    this.f = f
    this.latest = new LatestValueSink(this)
  }

  event (t: Time, x: B): void {
    if (this.latest.hasValue) {
      const f = this.f
      // TODO: value should be boxed to avoid ! bang
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.sink.event(t, f(this.latest.value!, x))
    }
  }
}

export class LatestValueSink<A> extends Pipe<A, A> implements Sink<A> {
  hasValue: boolean;
  value?: A;

  constructor (sink: Sink<unknown>) {
    super(sink)
    this.hasValue = false
  }

  event (_t: Time, x: A): void {
    this.value = x
    this.hasValue = true
  }

  end (): void {}
}
