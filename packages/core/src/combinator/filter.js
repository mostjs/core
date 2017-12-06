/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import Filter from '../fusion/Filter'
import { empty, isCanonicalEmpty } from '../source/empty'

/**
 * Retain only items matching a predicate
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @param {Stream} stream stream to filter
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
export const filter = (p, stream) =>
  Filter.create(p, stream)

/**
 * Skip repeated events, using === to detect duplicates
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
export const skipRepeats = stream =>
  skipRepeatsWith(same, stream)

/**
 * Skip repeated events using the provided equals function to detect duplicates
 * @param {function(a:*, b:*):boolean} equals optional function to compare items
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
export const skipRepeatsWith = (equals, stream) =>
  isCanonicalEmpty(stream) ? empty()
    : new SkipRepeats(equals, stream)

class SkipRepeats {
  constructor (equals, source) {
    this.equals = equals
    this.source = source
  }

  run (sink, scheduler) {
    return this.source.run(new SkipRepeatsSink(this.equals, sink), scheduler)
  }
}

class SkipRepeatsSink extends Pipe {
  constructor (equals, sink) {
    super(sink)
    this.equals = equals
    this.value = void 0
    this.init = true
  }

  event (t, x) {
    if (this.init) {
      this.init = false
      this.value = x
      this.sink.event(t, x)
    } else if (!this.equals(this.value, x)) {
      this.value = x
      this.sink.event(t, x)
    }
  }
}

function same (a, b) {
  return a === b
}
