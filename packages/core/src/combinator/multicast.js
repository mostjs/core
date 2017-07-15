import { append, findIndex, remove } from '@most/prelude'
import { disposeNone, disposeOnce } from '@most/disposable'
import { tryEnd, tryEvent } from '../source/tryEvent'

export const multicast = stream =>
  stream instanceof Multicast ? stream : new Multicast(stream)

class Multicast {
  constructor (source) {
    this.source = new MulticastSource(source)
  }
  run (sink, scheduler) {
    return this.source.run(sink, scheduler)
  }
}

export class MulticastSource {
  constructor (source) {
    this.source = source
    this.sinks = []
    this.disposable = disposeNone()
  }

  run (sink, scheduler) {
    const n = this.add(sink)
    if (n === 1) {
      this.disposable = this.source.run(this, scheduler)
    }
    return disposeOnce(new MulticastDisposable(this, sink))
  }

  dispose () {
    const disposable = this.disposable
    this.disposable = disposeNone()
    return disposable.dispose()
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

export class MulticastDisposable {
  constructor (source, sink) {
    this.source = source
    this.sink = sink
  }

  dispose () {
    if (this.source.remove(this.sink) === 0) {
      this.source.dispose()
    }
  }
}
