/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { empty } from '../source/empty'
import Pipe from '../sink/Pipe'

export const withArrayValues = (array, stream) =>
  zipArrayValues(keepLeft, array, stream)

export const zipArrayValues = (f, array, stream) =>
  array.length === 0 || stream === empty()
    ? empty()
    : new ZipArrayValues(f, array, stream)

const keepLeft = (a, _) => a

class ZipArrayValues {
  constructor (f, values, source) {
    this.f = f
    this.values = values
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new ZipArrayValuesSink(this.f, this.values, sink), scheduler)
  }
}

class ZipArrayValuesSink extends Pipe {
  constructor (f, values, sink) {
    super(sink)
    this.f = f
    this.values = values
    this.index = 0
  }

  event (t, b) {
    const f = this.f
    this.sink.event(t, f(this.values[this.index], b))

    this.index += 1
    if (this.index >= this.values.length) {
      this.sink.end(t)
    }
  }
}
