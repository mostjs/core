import { Sink, Scheduler, Disposable } from '@most/types' // eslint-disable-line no-unused-vars

/** @license MIT License (c) copyright 2010-2017 original author or authors */

export type RunStream<A> = (sink: Sink<A>, scheduler: Scheduler) => Disposable

export const newStream = <A>(run: RunStream<A>): Stream<A> => new Stream(run)

class Stream<A> {
  readonly run: RunStream<A>;
  constructor (run: RunStream<A>) {
    this.run = run
  }
}
