/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { propagateEventTask } from '../scheduler/PropagateTask'
import { periodic as schedulePeriodic } from '@most/scheduler'
import { Stream, Sink, Scheduler } from '@most/types' // eslint-disable-line no-unused-vars

/**
 * Create a stream of events that occur at a regular period
 * @param {Number} period periodicity of events
 * @returns {Stream} new stream of periodic events, the event value is undefined
 */
export const periodic = (period: number): Stream<void> =>
  new Periodic(period)

class Periodic {
  private readonly period: number;

  constructor (period: number) {
    this.period = period
  }

  run (sink: Sink<void>, scheduler: Scheduler) {
    return schedulePeriodic(this.period, propagateEventTask(undefined, sink), scheduler)
  }
}
