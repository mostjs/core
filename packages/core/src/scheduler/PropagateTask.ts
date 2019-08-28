/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import fatal from '../fatalError'
import { Sink, Time, Task, Disposable } from '@most/types'

export type PropagateTaskRun<A> =
  (time: number, value: A, sink: Sink<A>) => void

export const propagateTask = <A>(run: PropagateTaskRun<A>, value: A, sink: Sink<A>): PropagateTask => new PropagateRunEventTask(run, value, sink)

export const propagateEventTask = <A>(value: A, sink: Sink<A>): PropagateTask => new PropagateEventTask(value, sink)

export const propagateEndTask = (sink: Sink<unknown>): PropagateTask => new PropagateEndTask(sink)

export const propagateErrorTask = (value: Error, sink: Sink<Error>): PropagateTask => new PropagateErrorTask(value, sink)

export abstract class PropagateTask implements Task, Disposable {
  active: boolean = true

  constructor (protected readonly sink: Sink<unknown>) {}

  protected abstract runIfActive(t: Time): void

  dispose (): void {
    this.active = false
  }

  run (t: Time): void {
    if (!this.active) {
      return
    }
    this.runIfActive(t)
  }

  error (t: Time, e: Error): void {
    // TODO: Remove this check and just do this.sink.error(t, e)?
    if (!this.active) {
      return fatal(e)
    }
    this.sink.error(t, e)
  }
}

class PropagateRunEventTask<A> extends PropagateTask implements Task, Disposable {
  constructor (private readonly runEvent: PropagateTaskRun<A>, private readonly value: A, sink: Sink<A>) {
    super(sink)
  }

  protected runIfActive (t: Time): void {
    this.runEvent(t, this.value, this.sink)
  }
}

class PropagateEventTask<A> extends PropagateTask implements Task, Disposable {
  constructor (private readonly value: A, sink: Sink<A>) {
    super(sink)
  }

  protected runIfActive (t: Time): void {
    this.sink.event(t, this.value)
  }
}

class PropagateEndTask extends PropagateTask implements Task, Disposable {
  protected runIfActive (t: Time): void {
    this.sink.end(t)
  }
}

class PropagateErrorTask extends PropagateTask implements Task, Disposable {
  constructor (private readonly value: Error, sink: Sink<never>) {
    super(sink)
  }

  protected runIfActive (t: Time): void {
    this.sink.error(t, this.value)
  }
}
