/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { run } from '../../src/run'
import { newDefaultScheduler } from '@most/scheduler'
import { Time, Stream, Sink } from '@most/types'

/**
* Reduce a stream to produce a single result.  Note that reducing an infinite
* stream will return a Promise that never fulfills, but that may reject if an error
* occurs.
* @param f reducer function
* @param initial initial value
* @param stream to reduce
* @returns promise for the final result of the reduce
*/
export function reduce <A, B> (f: (b: B, a: A) => B, initial: B, stream: Stream<A>): Promise<B> {
  return new Promise((resolve, reject) => {
    run(new ReduceSink(f, initial, resolve, reject), newDefaultScheduler(), stream)
  })
}

class ReduceSink<A, B> implements Sink<A> {
  private readonly f: (b: B, a: A) => B
  private value: B
  private readonly resolve: (b: B) => void
  private readonly reject: (e: Error) => void

  constructor (f: (b: B, a: A) => B, value: B, resolve: (b: B) => void, reject: (e: Error) => void) {
    this.f = f
    this.value = value
    this.resolve = resolve
    this.reject = reject
  }
  event (_t: Time, x: A): void {
    this.value = this.f(this.value, x)
  }
  error (_t: Time, e: Error): void {
    this.reject(e)
  }
  end (): void {
    this.resolve(this.value)
  }
}
