/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import Filter from './Filter'
import FilterMap from './FilterMap'
import { compose } from '@most/prelude'
import { isCanonicalEmpty, empty } from '../source/empty'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types'

export default class Map<A, B> implements Stream<B> {
  readonly f: (a: A) => B;
  readonly source: Stream<A>;

  constructor(f: (a: A) => B, source: Stream<A>) {
    this.f = f
    this.source = source
  }

  run(sink: Sink<B>, scheduler: Scheduler): Disposable {
    return this.source.run(new MapSink(this.f, sink), scheduler)
  }

  /**
   * Create a mapped source, fusing adjacent map.map, filter.map,
   * and filter.map.map if possible
   * @param {function(*):*} f mapping function
   * @param {{run:function}} source source to map
   * @returns {Map|FilterMap} mapped source, possibly fused
   */
  static create <A, B>(f: (a: A) => B, source: Stream<A>): Stream<B> {
    if (isCanonicalEmpty(source)) {
      return empty()
    }

    if (source instanceof Map) {
      return new Map(compose(f, source.f), source.source)
    }

    if (source instanceof Filter) {
      return new FilterMap(source.p, f, source.source)
    }

    return new Map(f, source)
  }
}

class MapSink<A, B> extends Pipe<A, B> implements Sink<A> {
  private readonly f: (a: A) => B;

  constructor(f: (a: A) => B, sink: Sink<B>) {
    super(sink)
    this.f = f
  }

  event(t: Time, x: A): void {
    const f = this.f
    this.sink.event(t, f(x))
  }
}
