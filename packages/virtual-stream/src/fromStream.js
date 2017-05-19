import { at } from './event'
import { finite, never, errored } from './vstream'

export const fromStream = (stream, scheduler) =>
  new Promise(collect(stream, scheduler))
    .then(disposeAndReturn)

const collect = (stream, scheduler) => resolve =>
  new Collect(stream, scheduler, resolve)

const disposeAndReturn = ({ disposable, vstream }) => {
  disposable.dispose()
  return vstream
}

class Collect {
  constructor (stream, scheduler, resolve) {
    this.resolve = resolve
    this.events = []
    this.vstream = never()
    this.disposable = stream.run(this, scheduler)
  }

  event (t, x) {
    this.events.push(at(t, x))
  }

  end (t) {
    this.vstream = finite(this.events, t)
    this.resolve(this)
  }

  error (t, e) {
    this.vstream = errored(e, this.events, t)
    this.resolve(this)
  }
}
