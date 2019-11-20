/** @license MIT License (c) copyright 2010 original author or authors */

import Pipe from '../sink/Pipe'
import { empty, isCanonicalEmpty } from '../source/empty'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types'

export interface SeedValue<S, V> { seed: S, value: V }

/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param stepper loop step function
 * @param seed initial seed value passed to first stepper call
 * @param stream event stream
 * @returns new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
export const loop = <A, B, S>(stepper: (seed: S, a: A) => SeedValue<S, B>, seed: S, stream: Stream<A>): Stream<B> =>
  isCanonicalEmpty(stream) ? empty()
    : new Loop(stepper, seed, stream)

class Loop<A, B, S> implements Stream<B> {
  private readonly step: (seed: S, a: A) => SeedValue<S, B>
  private readonly seed: S;
  private readonly source: Stream<A>

  constructor(stepper: (seed: S, a: A) => SeedValue<S, B>, seed: S, source: Stream<A>) {
    this.step = stepper
    this.seed = seed
    this.source = source
  }

  run(sink: Sink<B>, scheduler: Scheduler): Disposable {
    return this.source.run(new LoopSink(this.step, this.seed, sink), scheduler)
  }
}

class LoopSink<A, B, S> extends Pipe<A, B> implements Sink<A> {
  private readonly step: (seed: S, a: A) => SeedValue<S, B>;
  private seed: S;
  constructor(stepper: (seed: S, a: A) => SeedValue<S, B>, seed: S, sink: Sink<B>) {
    super(sink)
    this.step = stepper
    this.seed = seed
  }

  event(t: Time, x: A): void {
    const result = this.step(this.seed, x)
    this.seed = result.seed
    this.sink.event(t, result.value)
  }
}
