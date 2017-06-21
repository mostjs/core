/** @license MIT License (c) copyright 2010-2017 original author or authors */

import { propagateEndTask } from '../scheduler/PropagateTask'

export const empty = () => EMPTY

class Empty {
  run (sink, scheduler) {
    return scheduler.asap(propagateEndTask(sink))
  }
}

const EMPTY = new Empty()
