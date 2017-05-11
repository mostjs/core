/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Compute a stream by unfolding tuples of future values from a seed value
 * Event times may be controlled by returning a Promise from f
 * @param {function(seed:*):{value:*, seed:*, done:boolean}|Promise<{value:*, seed:*, done:boolean}>} f unfolding function accepts
 *  a seed and returns a new tuple with a value, new seed, and boolean done flag.
 *  If tuple.done is true, the stream will end.
 * @param {*} seed seed value
 * @returns {Stream} stream containing all value of all tuples produced by the
 *  unfolding function.
 */
export const unfold = (f, seed) =>
  new UnfoldStream(f, seed)

class UnfoldStream {
  constructor (f, seed) {
    this.f = f
    this.value = seed
  }

  run (sink, scheduler) {
    return new Unfold(this.f, this.value, sink, scheduler)
  }
}

class Unfold {
  constructor (f, x, sink, scheduler) {
    this.f = f
    this.sink = sink
    this.scheduler = scheduler
    this.active = true

    const err = e =>
      this.sink.error(this.scheduler.now(), e)

    const start = unfold =>
      stepUnfold(unfold, x)

    Promise.resolve(this).then(start).catch(err)
  }

  dispose () {
    this.active = false
  }
}

function stepUnfold (unfold, x) {
  const f = unfold.f
  return Promise.resolve(f(x))
    .then(tuple => continueUnfold(unfold, tuple))
}

function continueUnfold (unfold, tuple) {
  if (tuple.done) {
    unfold.sink.end(unfold.scheduler.now())
    return tuple.value
  }

  unfold.sink.event(unfold.scheduler.now(), tuple.value)

  return unfold.active ? stepUnfold(unfold, tuple.seed) : tuple.value
}
