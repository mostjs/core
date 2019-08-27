/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { Disposable, Sink, Task, Time } from '@most/types'

import fatal from '../fatalError'

export type PropagateTaskRun<A> =
  (time: number, value: A, sink: Sink<A>) => void

export const propagateTask = <A>(run: PropagateTaskRun<A>, value: A, sink: Sink<A>): PropagateTask<A> => new PropagateRunEventTask(run, value, sink)

export const propagateEventTask = <A>(value: A, sink: Sink<A>): PropagateTask<A> => new PropagateEventTask(value, sink)

export const propagateEndTask = (sink: Sink<unknown>): PropagateTask<never> => new PropagateEndTask(sink)

export const propagateErrorTask = <E extends Error, A>(value: E, sink: Sink<A>): PropagateErrorTask<E, A> => new PropagateErrorTask(value, sink)

export abstract class PropagateTask<A> implements Task, Disposable {
  public active: boolean = true;

  constructor(protected readonly sink: Sink<A>) { }

  dispose(): void {
    this.active = false
  }

  run(t: Time): void {
    if (!this.active) {
      return
    }
    return this.runIfActive(t)
  }

  abstract runIfActive(t: Time): void

  error(t: Time, e: Error): void {
    // TODO: Remove this check and just do this.sink.error(t, e)?
    if (!this.active) {
      return fatal(e)
    }
    this.sink.error(t, e)
  }
}

export class PropagateRunEventTask<A> extends PropagateTask<A> {
  constructor(private readonly _run: PropagateTaskRun<A>, private readonly value: A, sink: Sink<A>) {
    super(sink)
  }

  runIfActive(t: Time): void {
    const run = this._run
    run(t, this.value, this.sink)
  }
}

export class PropagateEventTask<A> extends PropagateTask<A> {
  constructor(private readonly value: A, sink: Sink<A>) {
    super(sink)
  }

  runIfActive(t: Time): void {
    this.sink.event(t, this.value)
  }
}

export class PropagateEndTask<A> extends PropagateTask<A> {
  runIfActive(t: Time): void {
    this.sink.end(t)
  }
}

export class PropagateErrorTask<E extends Error, A> extends PropagateTask<A> {
  constructor(private readonly value: E, sink: Sink<A>) {
    super(sink)
  }

  runIfActive(t: Time): void {
    this.sink.error(t, this.value)
  }
}

// const runEvent = <A>(t: Time, x: A, sink: Sink<A>): void => sink.event(t, x)

// const runEnd = (t: Time, _: void, sink: Sink<void>): void => sink.end(t)

// const runError = (t: Time, e: Error, sink: Sink<Error>): void => sink.error(t, e)
