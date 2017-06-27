import { append, remove, findIndex } from '@most/prelude'
import { tryEvent, tryEnd } from '../source/tryEvent'

const dispose = disposable => disposable.dispose()

const emptyDisposable = {
  dispose () {}
}

class MulticastDisposable {
  constructor (source, sink) {
    this.source = source
    this.sink = sink
    this.disposed = false
  }

  dispose () {
    if (this.disposed) {
      return
    }
    this.disposed = true
    const remaining = this.source.remove(this.sink)
    return remaining === 0 && this.source._dispose()
  }
}

class MulticastSource {
  constructor (source) {
    this.source = source
    this.sinks = []
    this._disposable = emptyDisposable
  }

  run (sink, scheduler) {
    const n = this.add(sink)
    if (n === 1) {
      this._disposable = this.source.run(this, scheduler)
    }
    return new MulticastDisposable(this, sink)
  }

  _dispose () {
    const disposable = this._disposable
    this._disposable = emptyDisposable
    return Promise.resolve(disposable).then(dispose)
  }

  add (sink) {
    this.sinks = append(sink, this.sinks)
    return this.sinks.length
  }

  remove (sink) {
    const i = findIndex(sink, this.sinks)
    // istanbul ignore next
    if (i >= 0) {
      this.sinks = remove(i, this.sinks)
    }

    return this.sinks.length
  }

  event (time, value) {
    const s = this.sinks
    if (s.length === 1) {
      return s[0].event(time, value)
    }
    for (let i = 0; i < s.length; ++i) {
      tryEvent(time, value, s[i])
    }
  }

  end (time) {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      tryEnd(time, s[i])
    }
  }

  error (time, err) {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      s[i].error(time, err)
    }
  }
}

class Multicast {
  constructor (source) {
    this.source = new MulticastSource(source)
  }
  run (sink, scheduler) {
    this.source.run(sink, scheduler)
  }
}

export const multicast = stream =>
  stream instanceof Multicast ? stream : new Multicast(stream)
