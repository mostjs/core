/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { propagateEndTask } from '../scheduler/PropagateTask'
import { asap } from '@most/scheduler'

export const empty = () => EMPTY

export const isCanonicalEmpty = stream =>
  stream === EMPTY

class Empty {
  run (sink, scheduler) {
    return asap(propagateEndTask(sink), scheduler)
  }
}

const EMPTY = new Empty()
