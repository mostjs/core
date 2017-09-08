/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

export default class SafeSink {
  constructor(sink) {
    this.sink = sink
    this.active = true
  }

  event(t, x) {
    if (!this.active) {
      return
    }
    this.sink.event(t, x)
  }

  end(t, x) {
    if (!this.active) {
      return
    }
    this.disable()
    this.sink.end(t, x)
  }

  error(t, e) {
    this.disable()
    this.sink.error(t, e)
  }

  disable() {
    this.active = false
    return this.sink
  }
}
