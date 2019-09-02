/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'
import { asap } from '@most/scheduler'
import { propagateEventTask } from '../scheduler/PropagateTask'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types'

/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param f reducer function
 * @param initial initial value
 * @param stream stream to scan
 * @returns new stream containing successive reduce results
 */
export const scan = <A, B>(f: (b: B, a: A) => B, initial: B, stream: Stream<A>): Stream<B> =>
  new Scan(f, initial, stream)

class Scan<A, B> implements Stream<B> {
  private readonly source: Stream<A>;
  private readonly f: (b: B, a: A) => B;
  private readonly value: B;

  constructor(f: (b: B, a: A) => B, z: B, source: Stream<A>) {
    this.source = source
    this.f = f
    this.value = z
  }

  run(sink: Sink<B>, scheduler: Scheduler): Disposable {
    const d1 = asap(propagateEventTask(this.value, sink), scheduler)
    const d2 = this.source.run(new ScanSink(this.f, this.value, sink), scheduler)
    return disposeBoth(d1, d2)
  }
}

class ScanSink<A, B> extends Pipe<A, B> implements Sink<A> {
  private readonly f: (b: B, a: A) => B
  private value: B;

  constructor(f: (b: B, a: A) => B, z: B, sink: Sink<B>) {
    super(sink)
    this.f = f
    this.value = z
  }

  event(t: Time, x: A): void {
    const f = this.f
    this.value = f(this.value, x)
    this.sink.event(t, this.value)
  }
}
