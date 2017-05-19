import { at } from './event'
import { finite, never, errored } from './vstream'
import { runEffects } from '@most/core'

export const fromStream = (stream, scheduler) => {
  const collect = new Collect(stream)
  return runEffects(collect, scheduler).then(() => collect.vstream)
}

class Collect {
  constructor (stream) {
    this.stream = stream
    this.events = []
    this.vstream = never()
  }

  run (sink, scheduler) {
    return this.stream.run(new CollectSink(sink, this), scheduler)
  }

  event (t, x) {
    this.events.push(at(t, x))
  }

  end (t) {
    this.vstream = finite(this.events, t)
  }

  error (t, e) {
    this.vstream = errored(e, this.events, t)
  }
}

class CollectSink {
  constructor (sink1, sink2) {
    this.sink1 = sink1
    this.sink2 = sink2
  }

  event (t, x) {
    this.sink1.event(t, x)
    this.sink2.event(t, x)
  }

  end (t) {
    this.sink1.end(t)
    this.sink2.end(t)
  }

  error (t, e) {
    this.sink1.event(t, e)
    this.sink2.event(t, e)
  }
}
