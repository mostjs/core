/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import { tail } from '@most/prelude'

/**
 * Compute a stream using an *async* generator, which yields promises
 * to control event times.
 * @param f
 * @returns {Stream}
 */
export function generate (f /*, ...args */) {
  return new GeneratorStream(f, tail(arguments))
}

class GeneratorStream {
  constructor (f, args) {
    this.f = f
    this.args = args
  }

  run (sink, scheduler) {
    return new Generate(this.f.apply(void 0, this.args), sink, scheduler)
  }
}

class Generate {
  constructor (iterator, sink, scheduler) {
    this.iterator = iterator
    this.sink = sink
    this.scheduler = scheduler
    this.active = true

    const err = e => this.sink.error(this.scheduler.now(), e)

    Promise.resolve(this).then(next).catch(err)
  }

  dispose () {
    this.active = false
  }
}

const next = (generate, x) =>
  generate.active ? handle(generate, generate.iterator.next(x)) : x

function handle (generate, result) {
  if (result.done) {
    return generate.sink.end(generate.scheduler.now(), result.value)
  }

  return Promise.resolve(result.value).then(function (x) {
    return emit(generate, x)
  }, function (e) {
    return error(generate, e)
  })
}

function emit (generate, x) {
  generate.sink.event(generate.scheduler.now(), x)
  return next(generate, x)
}

function error (generate, e) {
  return handle(generate, generate.iterator.throw(e))
}

