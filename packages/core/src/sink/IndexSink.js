/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Sink from './Pipe'

export default class IndexSink extends Sink {
  constructor(i, sink) {
    super(sink)
    this.index = i
    this.active = true
    this.value = undefined
  }

  event(t, x) {
    if (!this.active) {
      return
    }
    this.value = x
    this.sink.event(t, this)
  }

  end(t) {
    if (!this.active) {
      return
    }
    this.active = false
    this.sink.event(t, this)
  }
}
