/** @license MIT License (c) copyright 2010-2017 original author or authors */
/** @author Brian Cavalier */

export default class Pipe {
  constructor (sink) {
    this.sink = sink
  }

  event (t, x) {
    return this.sink.event(t, x)
  }

  end (t) {
    return this.sink.end(t)
  }

  error (t, e) {
    return this.sink.error(t, e)
  }
}
