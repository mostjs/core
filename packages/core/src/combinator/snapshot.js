/** @license MIT License (c) copyright 2010 original author or authors */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'

export const sample = (values, stream) =>
  snapshot((_, x) => x, values, stream)

export const snapshot = (f, values, stream) =>
  new Snapshot(f, stream, values)

export class Snapshot {
  constructor (f, sampler, stream) {
    this.source = stream
    this.sampler = sampler
    this.f = f
  }

  run (sink, scheduler) {
    const sampleSink = new SnapshotSink(this.f, this.source, sink)
    const sourceDisposable = this.source.run(sampleSink.latest, scheduler)
    const samplerDisposable = this.sampler.run(sampleSink, scheduler)

    return disposeBoth(samplerDisposable, sourceDisposable)
  }
}

export class SnapshotSink extends Pipe {
  constructor (f, source, sink) {
    super(sink)
    this.source = source
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
