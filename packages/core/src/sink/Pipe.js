/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

export default class Pipe {
  /**
   * A sink mixin that simply forwards event, end, and error to
   * another sink.
   * @param sink
   * @constructor
   */
  constructor (sink) {
    this.sink = sink
  }

  event (t, x) {
    return this.sink.event(t, x)
  }

  end (t, x) {
    return this.sink.end(t, x)
  }

  error (t, e) {
    return this.sink.error(t, e)
  }
}

