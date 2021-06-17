import { at } from './event'
import { finite, errored } from './vstream'

export const fromStream = (stream, scheduler) =>
  new Promise(resolve => new Collect(stream, scheduler, resolve))

class Collect {
  constructor (stream, scheduler, resolve) {
    this.resolve = resolve
    this.events = []
    this.disposable = stream.run(this, scheduler)
  }

  event (t, x) {
    this.events.push(at(t, x))
  }

  end (t) {
    this._end(finite(this.events, t))
  }

  error (t, e) {
    this._end(errored(e, this.events, t))
  }

  _end (vstream) {
    this.disposable.dispose()
    this.resolve(vstream)
  }
}
