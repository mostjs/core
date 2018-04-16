/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { runEffects } from '../../src/runEffects'
import { tap } from '../../src/combinator/transform'
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
  let result = initial
  const source = tap(x => { result = x }, stream)
  return runEffects(source, newDefaultScheduler()).then(() => result)
}
