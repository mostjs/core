/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { runEffects } from '../../src/runEffects'
import { newDefaultScheduler } from '@most/scheduler'
import { tap } from '../../src/combinator/transform'
import { Stream } from '@most/types' // eslint-disable-line no-unused-vars

/**
 * Observe all the event values in the stream in time order. The
 * provided function `f` will be called for each event value
 * @param f function to call with each event value
 * @param stream stream to observe
 * @return promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
export const observe = <A>(f: (a: A) => void, stream: Stream<A>): Promise<void> =>
  drain(tap(f, stream))

/**
 * "Run" a stream by creating demand and consuming all events
 * @param stream stream to drain
 * @return promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
export const drain = <A>(stream: Stream<A>): Promise<void> =>
  runEffects(stream, newDefaultScheduler())
