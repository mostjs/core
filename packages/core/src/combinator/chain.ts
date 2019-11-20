/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { mergeConcurrently, mergeMapConcurrently } from './mergeConcurrently'
import { Stream } from '@most/types'

/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param f chaining function, must return a Stream
 * @param stream
 * @returns new stream containing all events from each stream returned by f
 */
export const chain = <A, B>(f: (value: A) => Stream<B>, stream: Stream<A>): Stream<B> => mergeMapConcurrently(f, Infinity, stream)

/**
 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer. Event arrival times are preserved.
 * @param stream stream of streams
 * @returns new stream containing all events of all inner streams
 */
export const join = <A>(stream: Stream<Stream<A>>): Stream<A> => mergeConcurrently(Infinity, stream)
