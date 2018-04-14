/** @license MIT License (c) copyright 2018 original author or authors */

import { runEffects, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { curry2 } from '@most/prelude'

/**
 * "Run" a stream by creating demand and consuming all events
 * @func
 * @since v0.1.0
 * @memberof module:@most/test
 * @param {Stream<T>} stream stream to drain
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
export const drain = (stream) => runEffects(stream, newDefaultScheduler())

/**
 * Observe all the event values in the stream in time order. The
 * provided function `f` will be called for each event value
 * @func
 * @since v0.1.0
 * @memberof module:@most/test
 * @param {function(x:T):*} fn function to call with each event value
 * @param {Stream<T>} stream stream to observe
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
export const observe = curry2((fn, stream) => drain(tap(fn, stream)))
