/** @license MIT License (c) copyright 2017 original author or authors */

import Pipe from '../sink/Pipe'
import { empty, isCanonicalEmpty } from '../source/empty'
import { take } from './slice'

export const withItems = (items, stream) =>
  zipItems(keepLeft, items, stream)

export const zipItems = (f, items, stream) =>
  isCanonicalEmpty(stream) || items.length === 0
    ? empty()
    : new ZipItems(f, items, take(items.length, stream))

const keepLeft = (a, _) => a

class ZipItems {
  constructor (f, items, source) {
    this.f = f
    this.items = items
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new ZipItemsSink(this.f, this.items, sink), scheduler)
  }
}

class ZipItemsSink extends Pipe {
  constructor (f, items, sink) {
    super(sink)
    this.f = f
    this.items = items
    this.index = 0
  }

  event (t, b) {
    const f = this.f
    this.sink.event(t, f(this.items[this.index], b))
    this.index += 1
  }
}
