/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { runEffects } from '../../src/runEffects'
import { newDefaultScheduler } from '@most/scheduler'
import { tap } from '../../src/combinator/transform'

/**
 * Observe all the event values in the stream in time order. The
 * provided function `f` will be called for each event value
 * @param {function(x:T):*} f function to call with each event value
 * @param {Stream<T>} stream stream to observe
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
export const observe = (f, stream) =>
  drain(tap(f, stream))

/**
 * "Run" a stream by creating demand and consuming all events
 * @param {Stream<T>} stream stream to drain
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
export const drain = stream =>
  runEffects(stream, newDefaultScheduler())
