/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'

export default class FilterMap {
  constructor (p, f, source) {
    this.p = p
    this.f = f
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler)
  }
}

class FilterMapSink extends Pipe {
  constructor (p, f, sink) {
    super(sink)
    this.p = p
    this.f = f
  }

  event (t, x) {
    const f = this.f
    const p = this.p
    p(x) && this.sink.event(t, f(x))
  }
}
