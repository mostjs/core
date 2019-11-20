import { append, findIndex, remove } from '@most/prelude'
import { disposeNone, disposeOnce } from '@most/disposable'
import { tryEnd, tryEvent } from '../source/tryEvent'
import { isCanonicalEmpty } from '../source/empty'
import { Stream, Scheduler, Sink, Disposable, Time } from '@most/types'

export const multicast = <A>(stream: Stream<A>): Stream<A> =>
  stream instanceof Multicast || isCanonicalEmpty(stream)
    ? stream
    : new Multicast(stream)

class Multicast<A> implements Stream<A> {
  private readonly source: Stream<A>;
  constructor(source: Stream<A>) {
    this.source = new MulticastSource(source)
  }
  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(sink, scheduler)
  }
}

export class MulticastSource<A> implements Stream<A>, Disposable {
  private readonly source: Stream<A>;
  private sinks: Sink<A>[];
  private disposable: Disposable;

  constructor(source: Stream<A>) {
    this.source = source
    this.sinks = []
    this.disposable = disposeNone()
  }

  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    const n = this.add(sink)
    if (n === 1) {
      this.disposable = this.source.run(this, scheduler)
    }
    return disposeOnce(new MulticastDisposable(this, sink))
  }

  dispose(): void {
    const disposable = this.disposable
    this.disposable = disposeNone()
    return disposable.dispose()
  }

  add(sink: Sink<A>): number {
    this.sinks = append(sink, this.sinks)
    return this.sinks.length
  }

  remove(sink: Sink<A>): number {
    const i = findIndex(sink, this.sinks)
    // istanbul ignore next
    if (i >= 0) {
      this.sinks = remove(i, this.sinks)
    }

    return this.sinks.length
  }

  event(time: Time, value: A): void {
    const s = this.sinks
    if (s.length === 1) {
      return s[0].event(time, value)
    }
    for (let i = 0; i < s.length; ++i) {
      tryEvent(time, value, s[i])
    }
  }

  end(time: Time): void {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      tryEnd(time, s[i])
    }
  }

  error(time: Time, err: Error): void {
    const s = this.sinks
    for (let i = 0; i < s.length; ++i) {
      s[i].error(time, err)
    }
  }
}

export class MulticastDisposable<A> implements Disposable {
  private readonly source: MulticastSource<A>
  private readonly sink: Sink<A>

  constructor(source: MulticastSource<A>, sink: Sink<A>) {
    this.source = source
    this.sink = sink
  }

  dispose(): void {
    if (this.source.remove(this.sink) === 0) {
      this.source.dispose()
    }
  }
}
