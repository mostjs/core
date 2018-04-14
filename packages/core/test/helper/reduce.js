/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../../src/sink/Pipe'
import { runEffects } from '../../src/runEffects'
import { tap } from '../../src/combinator/transform'
import { newDefaultScheduler } from '@most/scheduler'

/**
* Reduce a stream to produce a single result.  Note that reducing an infinite
* stream will return a Promise that never fulfills, but that may reject if an error
* occurs.
* @param {function(result:*, x:*):*} f reducer function
* @param {*} initial initial value
* @param {Stream} stream to reduce
* @returns {Promise} promise for the final result of the reduce
*/
export function reduce (f, initial, stream) {
  let result = initial
  const source = tap(x => { result = x }, new Reduce(f, initial, stream))
  return runEffects(source, newDefaultScheduler()).then(() => result)
}

class Reduce {
  constructor (f, z, source) {
    this.source = source
    this.f = f
    this.value = z
  }

  run (sink, scheduler) {
    return this.source.run(new ReduceSink(this.f, this.value, sink), scheduler)
  }
}

class ReduceSink extends Pipe {
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

  end (t) {
    this.sink.end(t, this.value)
  }
}
