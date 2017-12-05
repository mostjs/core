/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { isCanonicalEmpty } from '../source/empty'

export default class Filter {
  constructor (p, source) {
    this.p = p
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new FilterSink(this.p, sink), scheduler)
  }

  /**
   * Create a filtered source, fusing adjacent filter.filter if possible
   * @param {function(x:*):boolean} p filtering predicate
   * @param {{run:function}} source source to filter
   * @returns {Filter} filtered source
   */
  static create (p, source) {
    if (isCanonicalEmpty(source)) {
      return source
    }

    if (source instanceof Filter) {
      return new Filter(and(source.p, p), source.source)
    }

    return new Filter(p, source)
  }
}

class FilterSink extends Pipe {
  constructor (p, sink) {
    super(sink)
    this.p = p
  }

  event (t, x) {
    const p = this.p
    p(x) && this.sink.event(t, x)
  }
}

const and = (p, q) => x => p(x) && q(x)
