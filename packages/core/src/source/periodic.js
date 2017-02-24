/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { propagateEventTask } from '../scheduler/PropagateTask'

/**
 * Create a stream of events that occur at a regular period
 * @param {Number} period periodicity of events in millis
 * @returns {Stream} new stream of periodic events, the event value is undefined
 */
export const periodic = period =>
  new Periodic(period)

class Periodic {
  constructor (period) {
    this.period = period
  }

  run (sink, scheduler) {
    return scheduler.periodic(this.period, propagateEventTask(undefined, sink))
  }
}
