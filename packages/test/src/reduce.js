/** @license MIT License (c) copyright 2018 original author or authors */

import { runEffects, tap } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { curry3 } from '@most/prelude'
import { bind } from './helpers'

function reduceSink (fn, initialValue, sink) {
  return {
    end: bind(sink.end, sink),
    error: bind(sink.error, sink),
    event: function (time, value) {
      initialValue = fn(initialValue, value)
      sink.event(time, initialValue)
    }
  }
}

function reduceStream (fn, initialValue, stream) {
  return {
    run: (sink, scheduler) => stream.run(reduceSink(fn, initialValue, sink), scheduler)
  }
}

/**
 * Reduce a stream to produce a single result.  Note that reducing an infinite
 * stream will return a Promise that never fulfills, but that may reject if an error
 * occurs.
 * @func
 * @memberof module:@most/test
 * @param {function(result, x)} fn reducer function
 * @param {*} initial initial value
 * @param {Stream} stream to reduce
 * @returns {Promise} promise for the final result of the reduce
 */
export const reduce = curry3(function (fn, initial, stream) {
  let result = initial
  const source = tap(x => { result = x }, reduceStream(fn, initial, stream))
  return runEffects(source, newDefaultScheduler())
    .then(() => result)
})
