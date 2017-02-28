/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Compute a stream by iteratively calling f to produce values
 * Event times may be controlled by returning a Promise from f
 * @param {function(x:*):*|Promise<*>} f
 * @param {*} x initial value
 * @returns {Stream}
 */
export const iterate = (f, x) =>
  new IterateStream(f, x)

class IterateStream {
  constructor (f, x) {
    this.f = f
    this.value = x
  }

  run (sink, scheduler) {
    return new Iterate(this.f, this.value, sink, scheduler)
  }
}

class Iterate {
  constructor (f, initial, sink, scheduler) {
    this.f = f
    this.sink = sink
    this.scheduler = scheduler
    this.active = true

    const err = e =>
      this.sink.error(this.scheduler.now(), e)

    const start = iterate =>
      stepIterate(iterate, initial)

    Promise.resolve(this).then(start).catch(err)
  }

  dispose () {
    this.active = false
  }
}

function stepIterate (iterate, x) {
  iterate.sink.event(iterate.scheduler.now(), x)

  if (!iterate.active) {
    return x
  }

  const f = iterate.f
  return Promise.resolve(f(x))
    .then(y => continueIterate(iterate, y))
}

const continueIterate = (iterate, x) =>
  iterate.active ? stepIterate(iterate, x) : iterate.value
