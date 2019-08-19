/** @license MIT License (c) copyright 2017 original author or authors */

import Pipe from '../sink/Pipe'
import { empty, isCanonicalEmpty } from '../source/empty'
import { take } from './slice'
import { Stream, Sink, Scheduler, Disposable, Time } from '@most/types'

export const withItems = <A> (items: Array<A>, stream: Stream<unknown>): Stream<A> =>
  zipItems(keepLeft, items, stream)

export const zipItems = <A, B, C> (f: (a: A, b: B) => C, items: A[], stream: Stream<B>): Stream<C> =>
  isCanonicalEmpty(stream) || items.length === 0
    ? empty()
    : new ZipItems(f, items, take(items.length, stream))

const keepLeft = <A>(a: A): A => a

class ZipItems<A, B, C> implements Stream<C> {
  private readonly f: (a: A, b: B) => C
  private readonly items: A[]
  private readonly source: Stream<B>

  constructor (f: (a: A, b: B) => C, items: A[], source: Stream<B>) {
    this.f = f
    this.items = items
    this.source = source
  }

  run (sink: Sink<C>, scheduler: Scheduler): Disposable {
    return this.source.run(new ZipItemsSink(this.f, this.items, sink), scheduler)
  }
}

class ZipItemsSink<A, B, C> extends Pipe<B | C> implements Sink<B | C> {
  private readonly f: (a: A, b: B) => C
  private readonly items: A[]
  private index: number;

  constructor (f: (a: A, b: B) => C, items: A[], sink: Sink<C>) {
    super(sink)
    this.f = f
    this.items = items
    this.index = 0
  }

  event (t: Time, b: B): void {
    const f = this.f
    this.sink.event(t, f(this.items[this.index], b))
    this.index += 1
  }
}
