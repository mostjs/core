/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import fatal from '../fatalError'

export const propagateTask = (run, value, sink) =>
  new PropagateTask(run, value, sink)

export const propagateEventTask = (value, sink) =>
  propagateTask(runEvent, value, sink)

export const propagateEndTask = sink => propagateTask(runEnd, undefined, sink)

export const propagateErrorTask = (value, sink) =>
  propagateTask(runError, value, sink)

export class PropagateTask {
  constructor(run, value, sink) {
    this._run = run
    this.value = value
    this.sink = sink
    this.active = true
  }

  dispose() {
    this.active = false
  }

  run(t) {
    if (!this.active) {
      return
    }
    const run = this._run
    run(t, this.value, this.sink)
  }

  error(t, e) {
    // TODO: Remove this check and just do this.sink.error(t, e)?
    if (!this.active) {
      return fatal(e)
    }
    this.sink.error(t, e)
  }
}

const runEvent = (t, x, sink) => sink.event(t, x)

const runEnd = (t, _, sink) => sink.end(t)

const runError = (t, e, sink) => sink.error(t, e)
