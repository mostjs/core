import { Sink, Scheduler, Disposable, Stream } from '@most/types'

/** @license MIT License (c) copyright 2010-2017 original author or authors */

export type RunStream<A> = (sink: Sink<A>, scheduler: Scheduler) => Disposable

export const newStream = <A>(run: RunStream<A>): Stream<A> => new StreamImpl(run)

class StreamImpl<A> {
  readonly run: RunStream<A>;
  constructor(run: RunStream<A>) {
    this.run = run
  }
}
