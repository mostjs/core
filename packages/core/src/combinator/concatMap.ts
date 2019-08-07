/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { mergeMapConcurrently } from './mergeConcurrently'
import { Stream } from '@most/types' // eslint-disable-line no-unused-vars

/**
 * Map each value in stream to a new stream, and concatenate them all
 * stream:              -a---b---cX
 * f(a):                 1-1-1-1X
 * f(b):                        -2-2-2-2X
 * f(c):                                -3-3-3-3X
 * stream.concatMap(f): -1-1-1-1-2-2-2-2-3-3-3-3X
 * @param f function to map each value to a stream
 * @param stream
 * @returns new stream containing all events from each stream returned by f
 */
export const concatMap = <A, B>(f: (a: A) => Stream<B>, stream: Stream<A>): Stream<B> =>
  mergeMapConcurrently(f, 1, stream)
