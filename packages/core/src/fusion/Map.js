/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import Filter from './Filter'
import FilterMap from './FilterMap'
import { compose } from '@most/prelude'

export default class Map {
  constructor (f, source) {
    this.f = f
    this.source = source
  }

  run (sink, scheduler) {
    // eslint-disable-line no-extend-native
    return this.source.run(new MapSink(this.f, sink), scheduler)
  }

  /**
   * Create a mapped source, fusing adjacent map.map, filter.map,
   * and filter.map.map if possible
   * @param {function(*):*} f mapping function
   * @param {{run:function}} source source to map
   * @returns {Map|FilterMap} mapped source, possibly fused
   */
  static create (f, source) {
    if (source instanceof Map) {
      return new Map(compose(f, source.f), source.source)
    }

    if (source instanceof Filter) {
      return new FilterMap(source.p, f, source.source)
    }

    return new Map(f, source)
  }
}

class MapSink extends Pipe {
  constructor (f, sink) {
    super(sink)
    this.f = f
  }

  event (t, x) {
    const f = this.f
    this.sink.event(t, f(x))
  }
}
