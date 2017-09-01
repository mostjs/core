/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Map from '../fusion/Map'
import Pipe from '../sink/Pipe'

/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @param {Stream} stream stream to map
 * @returns {Stream} stream containing items transformed by f
 */
export const map = (f, stream) => Map.create(f, stream)

/**
* Replace each value in the stream with x
* @param {*} x
* @param {Stream} stream
* @returns {Stream} stream containing items replaced with x
*/
export const constant = (x, stream) => map(() => x, stream)

/**
* Perform a side effect for each item in the stream
* @param {function(x:*):*} f side effect to execute for each item. The
*  return value will be discarded.
* @param {Stream} stream stream to tap
* @returns {Stream} new stream containing the same items as this stream
*/
export const tap = (f, stream) => new Tap(f, stream)

class Tap {
  constructor(f, source) {
    this.source = source
    this.f = f
  }

  run(sink, scheduler) {
    return this.source.run(new TapSink(this.f, sink), scheduler)
  }
}

class TapSink extends Pipe {
  constructor(f, sink) {
    super(sink)
    this.f = f
  }

  event(t, x) {
    const f = this.f
    f(x)
    this.sink.event(t, x)
  }
}
