/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import Filter from '../fusion/Filter'
import { empty, isCanonicalEmpty } from '../source/empty'
import { Stream, Sink, Scheduler, Time, Disposable } from '@most/types'

/**
 * Retain only items matching a predicate
 * @param p filtering predicate called for each item
 * @param stream stream to filter
 * @returns stream containing only items for which predicate returns truthy
 */
export function filter<A, B extends A>(p: (a: A) => a is B, stream: Stream<A>): Stream<B>
export function filter<A>(p: (a: A) => boolean, stream: Stream<A>): Stream<A>
export function filter<A>(p: (a: A) => boolean, stream: Stream<A>): Stream<A> {
  return Filter.create(p, stream)
}

/**
 * Skip repeated events, using === to detect duplicates
 * @param stream stream from which to omit repeated events
 * @returns stream without repeated events
 */
export const skipRepeats = <A>(stream: Stream<A>): Stream<A> =>
  skipRepeatsWith(same, stream)

/**
 * Skip repeated events using the provided equals function to detect duplicates
 * @param equals optional function to compare items
 * @param stream stream from which to omit repeated events
 * @returns stream without repeated events
 */
export const skipRepeatsWith = <A>(equals: (a1: A, a2: A) => boolean, stream: Stream<A>): Stream<A> =>
  isCanonicalEmpty(stream) ? empty()
    : new SkipRepeats(equals, stream)

class SkipRepeats<A> implements Stream<A> {
  private readonly equals: (a1: A, a2: A) => boolean
  private readonly source: Stream<A>
  constructor(equals: (a1: A, a2: A) => boolean, source: Stream<A>) {
    this.equals = equals
    this.source = source
  }

  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(new SkipRepeatsSink(this.equals, sink), scheduler)
  }
}

class SkipRepeatsSink<A> extends Pipe<A, A> implements Sink<A> {
  private readonly equals: (a1: A, a2: A) => boolean
  private value?: A;
  private init: boolean;
  constructor(equals: (a1: A, a2: A) => boolean, sink: Sink<A>) {
    super(sink)
    this.equals = equals
    this.value = undefined
    this.init = true
  }

  event(t: Time, x: A): void {
    if (this.init) {
      this.init = false
      this.value = x
      this.sink.event(t, x)
      // TODO: value should be boxed to avoid ! bang
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } else if (!this.equals(this.value!, x)) {
      this.value = x
      this.sink.event(t, x)
    }
  }
}

function same <A>(a: A, b: A): boolean {
  return a === b
}
