/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'
import { asap } from '@most/scheduler'
import { propagateEventTask } from '../scheduler/PropagateTask'

/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @param {Stream} stream stream to scan
 * @returns {Stream} new stream containing successive reduce results
 */
export const scan = (f, initial, stream) => new Scan(f, initial, stream)

class Scan {
  constructor (f, z, source) {
    this.source = source
    this.f = f
    this.value = z
  }

  run (sink, scheduler) {
    const d1 = asap(propagateEventTask(this.value, sink), scheduler)
    const d2 = this.source.run(
      new ScanSink(this.f, this.value, sink),
      scheduler
    )
    return disposeBoth(d1, d2)
  }
}

class ScanSink extends Pipe {
  constructor (f, z, sink) {
    super(sink)
    this.f = f
    this.value = z
  }

  event (t, x) {
    const f = this.f
    this.value = f(this.value, x)
    this.sink.event(t, this.value)
  }
}
