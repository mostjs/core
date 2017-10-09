/** @license MIT License (c) copyright 2010 original author or authors */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'

export const pickLatestFrom = (values, stream) =>
  zipLatestFrom((_, x) => x, values, stream)

export const zipLatestFrom = (f, values, stream) =>
  new ZipLatestFrom(f, stream, values)

export class ZipLatestFrom {
  constructor (f, sampler, stream) {
    this.source = stream
    this.sampler = sampler
    this.f = f
  }

  run (sink, scheduler) {
    const sampleSink = new ZipLatestSink(this.f, this.source, sink)
    const sourceDisposable = this.source.run(sampleSink.hold, scheduler)
    const samplerDisposable = this.sampler.run(sampleSink, scheduler)

    return disposeBoth(samplerDisposable, sourceDisposable)
  }
}

export class ZipLatestSink extends Pipe {
  constructor (f, source, sink) {
    super(sink)
    this.source = source
    this.f = f
    this.hold = new SampleHold(this)
  }

  event (t, x) {
    if (this.hold.hasValue) {
      const f = this.f
      this.sink.event(t, f(this.hold.value, x))
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
