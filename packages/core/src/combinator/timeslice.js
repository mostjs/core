/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'
import { join } from './chain'
import SettableDisposable from '../disposable/SettableDisposable'

export const until = (signal, stream) =>
  new Until(signal, stream)

export const since = (signal, stream) =>
  new Since(signal, stream)

export const during = (timeWindow, stream) =>
  until(join(timeWindow), since(timeWindow, stream))

class Until {
  constructor (maxSignal, source) {
    this.maxSignal = maxSignal
    this.source = source
  }

  run (sink, scheduler) {
    const disposable = new SettableDisposable()

    const d1 = this.source.run(sink, scheduler)
    const d2 = this.maxSignal.run(new UntilSink(sink, disposable), scheduler)
    disposable.setDisposable(disposeBoth(d1, d2))

    return disposable
  }
}

class Since {
  constructor (minSignal, source) {
    this.minSignal = minSignal
    this.source = source
  }

  run (sink, scheduler) {
    const min = new LowerBoundSink(this.minSignal, sink, scheduler)
    const d = this.source.run(new SinceSink(min, sink), scheduler)

    return disposeBoth(min, d)
  }
}

class SinceSink extends Pipe {
  constructor (min, sink) {
    super(sink)
    this.min = min
  }

  event (t, x) {
    if (this.min.allow) {
      this.sink.event(t, x)
    }
  }
}

class LowerBoundSink extends Pipe {
  constructor (signal, sink, scheduler) {
    super(sink)
    this.allow = false
    this.disposable = signal.run(this, scheduler)
  }

  event (/* t, x */) {
    this.allow = true
    this.dispose()
  }

  end () {}

  dispose () {
    this.disposable.dispose()
  }
}

class UntilSink extends Pipe {
  constructor (sink, disposable) {
    super(sink)
    this.disposable = disposable
  }

  event (t, x) {
    this.disposable.dispose()
    this.sink.end(t)
  }

  end () {}
}
