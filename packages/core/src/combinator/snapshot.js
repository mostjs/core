/** @license MIT License (c) copyright 2010 original author or authors */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'

export const sample = (values, sampler) =>
  snapshot((_, x) => x, values, sampler)

export const snapshot = (f, values, sampler) =>
  new Snapshot(f, sampler, values)

export class Snapshot {
  constructor (f, sampler, values) {
    this.values = values
    this.sampler = sampler
    this.f = f
  }

  run (sink, scheduler) {
    const sampleSink = new SnapshotSink(this.f, sink)
    const valuesDisposable = this.values.run(sampleSink.latest, scheduler)
    const samplerDisposable = this.sampler.run(sampleSink, scheduler)

    return disposeBoth(samplerDisposable, valuesDisposable)
  }
}

export class SnapshotSink extends Pipe {
  constructor (f, sink) {
    super(sink)
    this.f = f
    this.latest = new LatestValueSink(this)
  }

  event (t, x) {
    if (this.latest.hasValue) {
      const f = this.f
      this.sink.event(t, f(this.latest.value, x))
    }
  }
}

export class LatestValueSink extends Pipe {
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
