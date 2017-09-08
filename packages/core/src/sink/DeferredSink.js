/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { defer } from '../task'

export default class DeferredSink {
  constructor(sink) {
    this.sink = sink
    this.events = []
    this.active = true
  }

  event(t, x) {
    if (!this.active) {
      return
    }

    if (this.events.length === 0) {
      defer(new PropagateAllTask(this.sink, t, this.events))
    }

    this.events.push({ time: t, value: x })
  }

  end(t, x) {
    if (!this.active) {
      return
    }

    this._end(new EndTask(t, x, this.sink))
  }

  error(t, e) {
    this._end(new ErrorTask(t, e, this.sink))
  }

  _end(task) {
    this.active = false
    defer(task)
  }
}

class PropagateAllTask {
  constructor(sink, time, events) {
    this.sink = sink
    this.events = events
    this.time = time
  }

  run() {
    const events = this.events;
    const sink = this.sink;
    let event;

    for (let i = 0, l = events.length; i < l; ++i) {
      event = events[i]
      this.time = event.time
      sink.event(event.time, event.value)
    }

    events.length = 0
  }

  error(e) {
    this.sink.error(this.time, e)
  }
}

class EndTask {
  constructor(t, x, sink) {
    this.time = t
    this.value = x
    this.sink = sink
  }

  run() {
    this.sink.end(this.time, this.value)
  }

  error(e) {
    this.sink.error(this.time, e)
  }
}

class ErrorTask {
  constructor(t, e, sink) {
    this.time = t
    this.value = e
    this.sink = sink
  }

  run() {
    this.sink.error(this.time, this.value)
  }

  error(e) {
    throw e
  }
}
