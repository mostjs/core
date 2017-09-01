/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeAll } from '@most/disposable'
import { join } from './chain'

export const until = (signal, stream) => new Until(signal, stream)

export const since = (signal, stream) => new Since(signal, stream)

export const during = (timeWindow, stream) =>
  until(join(timeWindow), since(timeWindow, stream))

class Until {
  constructor (maxSignal, source) {
    this.maxSignal = maxSignal
    this.source = source
  }

  run (sink, scheduler) {
    const min = new Bound(-Infinity, sink)
    const max = new UpperBound(this.maxSignal, sink, scheduler)
    const disposable = this.source.run(
      new TimeWindowSink(min, max, sink),
      scheduler
    )

    return disposeAll([min, max, disposable])
  }
}

class Since {
  constructor (minSignal, source) {
    this.minSignal = minSignal
    this.source = source
  }

  run (sink, scheduler) {
    const min = new LowerBound(this.minSignal, sink, scheduler)
    const max = new Bound(Infinity, sink)
    const disposable = this.source.run(
      new TimeWindowSink(min, max, sink),
      scheduler
    )

    return disposeAll([min, max, disposable])
  }
}

class Bound extends Pipe {
  constructor (value, sink) {
    super(sink)
    this.value = value
  }

  event () {}
  end () {}

  dispose () {}
}

class TimeWindowSink extends Pipe {
  constructor (min, max, sink) {
    super(sink)
    this.min = min
    this.max = max
  }

  event (t, x) {
    if (t >= this.min.value && t < this.max.value) {
      this.sink.event(t, x)
    }
  }
}

class LowerBound extends Pipe {
  constructor (signal, sink, scheduler) {
    super(sink)
    this.value = Infinity
    this.disposable = signal.run(this, scheduler)
  }

  event (t /*, x */) {
    if (t < this.value) {
      this.value = t
    }
  }

  end () {}

  dispose () {
    return this.disposable.dispose()
  }
}

class UpperBound extends Pipe {
  constructor (signal, sink, scheduler) {
    super(sink)
    this.value = Infinity
    this.disposable = signal.run(this, scheduler)
  }

  event (t, x) {
    if (t < this.value) {
      this.value = t
      this.sink.end(t)
    }
  }

  end () {}

  dispose () {
    return this.disposable.dispose()
  }
}
