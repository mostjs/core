/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'
import { cancelTask, delay as scheduleDelay } from '@most/scheduler'
import { propagateEndTask, propagateEventTask } from '../scheduler/PropagateTask'

/**
 * @param {Number} delayTime milliseconds to delay each item
 * @param {Stream} stream
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
export const delay = (delayTime, stream) =>
  delayTime <= 0 ? stream : new Delay(delayTime, stream)

class Delay {
  constructor (dt, source) {
    this.dt = dt
    this.source = source
  }

  run (sink, scheduler) {
    const delaySink = new DelaySink(this.dt, sink, scheduler)
    return disposeBoth(delaySink, this.source.run(delaySink, scheduler))
  }
}

class DelaySink extends Pipe {
  constructor (dt, sink, scheduler) {
    super(sink)
    this.dt = dt
    this.scheduler = scheduler
    this.tasks = []
  }

  dispose () {
    this.tasks.forEach(cancelTask)
  }

  event (t, x) {
    this.tasks.push(scheduleDelay(this.dt, propagateEventTask(x, this.sink), this.scheduler))
  }

  end (t) {
    this.tasks.push(scheduleDelay(this.dt, propagateEndTask(this.sink), this.scheduler))
  }
}
