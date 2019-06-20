/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { run } from '../../src/run'
// import { tap } from '../../src/combinator/transform'
import { newDefaultScheduler } from '@most/scheduler'

/**
* Reduce a stream to produce a single result.  Note that reducing an infinite
* stream will return a Promise that never fulfills, but that may reject if an error
* occurs.
* @param {function(result:*, x:*):*} f reducer function
* @param {*} initial initial value
* @param {Stream} stream to reduce
* @returns {Promise} promise for the final result of the reduce
*/
export function reduce (f, initial, stream) {
  return new Promise((resolve, reject) => {
    run(new ReduceSink(f, initial, resolve, reject), newDefaultScheduler(), stream)
  })
}

class ReduceSink {
  constructor (f, value, resolve, reject) {
    this.f = f
    this.value = value
    this.resolve = resolve
    this.reject = reject
  }
  event (t, x) {
    this.value = this.f(this.value, x)
  }
  error (t, e) {
    this.reject(e)
  }
  end (t) {
    this.resolve(this.value)
  }
}
