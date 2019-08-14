/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import fatal from '../fatalError'
import { Sink, Time, Task } from '@most/types'

export type PropagateTaskRun<A, B = A> =
  (time: number, value: A, sink: Sink<B>) => any

export const propagateTask = <A, B = A>(run: PropagateTaskRun<A, B>, value: A, sink: Sink<B>): PropagateTask<A, B> => new PropagateTask(run, value, sink)

export const propagateEventTask = <A>(value: A, sink: Sink<A>): PropagateTask<A> => propagateTask(runEvent, value, sink)

export const propagateEndTask = (sink: Sink<unknown>): PropagateTask<undefined> => propagateTask(runEnd, undefined, sink)

export const propagateErrorTask = (value: Error, sink: Sink<unknown>): PropagateTask<any> => propagateTask(runError, value, sink)

export class PropagateTask<A, B = A> implements Task {
  active: boolean;
  readonly sink: Sink<B>;
  readonly value: A;
  private readonly _run: (t: Time, a: A, sink: Sink<B>) => void

  constructor (run: (t: Time, a: A, sink: Sink<B>) => void, value: A, sink: Sink<B>) {
    this._run = run
    this.value = value
    this.sink = sink
    this.active = true
  }

  dispose (): void {
    this.active = false
  }

  run (t: Time): void {
    if (!this.active) {
      return
    }
    const run = this._run
    run(t, this.value, this.sink)
  }

  error (t: Time, e: Error): void {
    // TODO: Remove this check and just do this.sink.error(t, e)?
    if (!this.active) {
      return fatal(e)
    }
    this.sink.error(t, e)
  }
}

const runEvent = <A>(t: Time, x: A, sink: Sink<A>): void => sink.event(t, x)

const runEnd = (t: Time, _: unknown, sink: Sink<unknown>): void => sink.end(t)

const runError = (t: Time, e: Error, sink: Sink<unknown>): void => sink.error(t, e)
