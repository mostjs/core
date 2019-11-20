/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Map from '../fusion/Map'
import Pipe from '../sink/Pipe'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types'

/**
 * Transform each value in the stream by applying f to each
 * @param f mapping function
 * @param stream stream to map
 * @returns stream containing items transformed by f
 */
export const map = <A, B>(f: (a: A) => B, stream: Stream<A>): Stream<B> =>
  Map.create(f, stream)

/**
* Replace each value in the stream with x
* @param x
* @param stream
* @returns stream containing items replaced with x
*/
export const constant = <A, B>(x: B, stream: Stream<A>): Stream<B> =>
  map(() => x, stream)

/**
* Perform a side effect for each item in the stream
* @param f side effect to execute for each item. The return value will be discarded.
* @param stream stream to tap
* @returns new stream containing the same items as this stream
*/
export const tap = <A>(f: (a: A) => unknown, stream: Stream<A>): Stream<A> =>
  new Tap(f, stream)

class Tap<A> implements Stream<A> {
  private readonly f: (a: A) => unknown;
  private readonly source: Stream<A>;

  constructor(f: (a: A) => unknown, source: Stream<A>) {
    this.source = source
    this.f = f
  }

  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(new TapSink(this.f, sink), scheduler)
  }
}

class TapSink<A> extends Pipe<A, A> implements Sink<A> {
  private readonly f: (a: A) => unknown;

  constructor(f: (a: A) => unknown, sink: Sink<A>) {
    super(sink)
    this.f = f
  }

  event(t: Time, x: A): void {
    const f = this.f
    f(x)
    this.sink.event(t, x)
  }
}
