/** @license MIT License (c) copyright 2010-2016 original author or authors */

import Stream from '../Stream'
import Pipe from '../sink/Pipe'
import * as dispose from '../disposable/dispose'

export const sample = (f, sampler, stream) =>
  new Stream(new SampleSource(f, sampler, stream))

export class SampleSource {
  constructor (f, sampler, stream) {
    this.source = stream.source
    this.sampler = sampler.source
    this.f = f
  }

  run (sink, scheduler) {
    const sampleSink = new SampleSink(this.f, this.source, sink)
    const sourceDisposable = this.source.run(sampleSink.hold, scheduler)
    const samplerDisposable = this.sampler.run(sampleSink, scheduler)

    return dispose.all([samplerDisposable, sourceDisposable])
  }
}

export class SampleSink extends Pipe {
  constructor (f, source, sink) {
    super(sink)
    this.sink = sink
    this.source = source
    this.f = f
    this.hold = new SampleHold(this)
  }

  event (t, x) {
    if (this.hold.hasValue) {
      const f = this.f
      this.sink.event(t, f(x, this.hold.value))
    }
  }
}

export class SampleHold extends Pipe {
  constructor (sink) {
    super(sink)
    this.hasValue = false
  }

  event (t, x) {
    this.value = x
    this.hasValue = true
  }

  end () {}
}
