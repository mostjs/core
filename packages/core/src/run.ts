/** @license MIT License (c) copyright 2010-2017 original author or authors */
import { Sink, Scheduler, Stream, Disposable } from '@most/types'

/**
 * Run a Stream, sending all its events to the provided Sink.
 */
export const run = <A>(sink: Sink<A>, scheduler: Scheduler, stream: Stream<A>): Disposable =>
  stream.run(sink, scheduler)
