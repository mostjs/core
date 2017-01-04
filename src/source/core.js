/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Stream from '../Stream'
import * as dispose from '../disposable/dispose'
import PropagateTask from '../scheduler/PropagateTask'

/**
 * Stream containing only x
 * @param {*} x
 * @returns {Stream}
 */
export const just = x => new Stream(new Just(x))

class Just {
  constructor (x) {
    this.value = x
  }

  run (sink, scheduler) {
    return scheduler.asap(new PropagateTask(runJust, this.value, sink))
  }
}

function runJust (t, x, sink) {
  sink.event(t, x)
  sink.end(t, void 0)
}

/**
 * Stream containing no events and ends immediately
 * @returns {Stream}
 */
export const empty = () => EMPTY

class EmptySource {
  run (sink, scheduler) {
    const task = PropagateTask.end(void 0, sink)
    scheduler.asap(task)

    return dispose.create(disposeEmpty, task)
  }
}

const disposeEmpty = task => task.dispose()

const EMPTY = new Stream(new EmptySource())

/**
 * Stream containing no events and never ends
 * @returns {Stream}
 */
export const never = () => NEVER

class NeverSource {
  run () {
    return dispose.empty()
  }
}

const NEVER = new Stream(new NeverSource())
