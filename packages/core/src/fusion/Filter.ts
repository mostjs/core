/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { isCanonicalEmpty } from '../source/empty'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types' // eslint-disable-line no-unused-vars

export default class Filter<A> {
  readonly p: (a: A) => boolean
  readonly source: Stream<A>

  constructor (p: (a: A) => boolean, source: Stream<A>) {
    this.p = p
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(new FilterSink(this.p, sink), scheduler)
  }

  /**
   * Create a filtered source, fusing adjacent filter.filter if possible
   * @param {function(x:*):boolean} p filtering predicate
   * @param {{run:function}} source source to filter
   * @returns {Filter} filtered source
   */
  static create <A> (p: (a: A) => boolean, source: Stream<A>) {
    if (isCanonicalEmpty(source)) {
      return source
    }

    if (source instanceof Filter) {
      return new Filter(and(source.p, p), source.source)
    }

    return new Filter(p, source)
  }
}

class FilterSink<A> extends Pipe<A> {
  private readonly p: (a: A) => boolean

  constructor (p: (a: A) => boolean, sink: Sink<A>) {
    super(sink)
    this.p = p
  }

  event (t: Time, x: A) {
    const p = this.p
    p(x) && this.sink.event(t, x)
  }
}

const and = <A>(p: (a: A) => boolean, q: (a: A) => boolean) => (x: A): boolean => p(x) && q(x)
