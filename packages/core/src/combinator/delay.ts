/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'
import { cancelTask, delay as scheduleDelay } from '@most/scheduler'
import { propagateEndTask, propagateEventTask } from '../scheduler/PropagateTask'
import { Stream, Sink, Scheduler, Disposable, ScheduledTask, Time } from '@most/types'

/**
 * @param delayTime milliseconds to delay each item
 * @param stream
 * @returns new stream containing the same items, but delayed by ms
 */
export const delay = <A>(delayTime: number, stream: Stream<A>): Stream<A> =>
  delayTime <= 0 ? stream : new Delay(delayTime, stream)

class Delay<A> implements Stream<A> {
  private readonly dt: number
  private readonly source: Stream<A>

  constructor (dt: number, source: Stream<A>) {
    this.dt = dt
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    const delaySink = new DelaySink(this.dt, sink, scheduler)
    return disposeBoth(delaySink, this.source.run(delaySink, scheduler))
  }
}

class DelaySink<A> extends Pipe<A, A> implements Sink<A>, Disposable {
  private readonly dt: number;
  private readonly scheduler: Scheduler;
  private readonly tasks: ScheduledTask[];
  constructor (dt: number, sink: Sink<A>, scheduler: Scheduler) {
    super(sink)
    this.dt = dt
    this.scheduler = scheduler
    this.tasks = []
  }

  dispose (): void {
    this.tasks.forEach(cancelTask)
  }

  event (_t: Time, x: A): void {
    this.tasks.push(scheduleDelay(this.dt, propagateEventTask(x, this.sink), this.scheduler))
  }

  end (): void {
    this.tasks.push(scheduleDelay(this.dt, propagateEndTask(this.sink), this.scheduler))
  }
}
