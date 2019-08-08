/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types' // eslint-disable-line no-unused-vars

export default class FilterMap<A, B> {
  private readonly p: (a: A) => boolean;
  private readonly f: (a: A) => B;
  private readonly source: Stream<A>;

  constructor (p: (a: A) => boolean, f: (a: A) => B, source: Stream<A>) {
    this.p = p
    this.f = f
    this.source = source
  }

  run (sink: Sink<B>, scheduler: Scheduler): Disposable {
    return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler)
  }
}

class FilterMapSink<A, B> extends Pipe<A | B> {
  private readonly p: (a: A) => boolean;
  private readonly f: (a: A) => B;

  constructor (p: (a: A) => boolean, f: (a: A) => B, sink: Sink<B>) {
    super(sink)
    this.p = p
    this.f = f
  }

  event (t: Time, x: A) {
    const f = this.f
    const p = this.p
    p(x) && this.sink.event(t, f(x))
  }
}
