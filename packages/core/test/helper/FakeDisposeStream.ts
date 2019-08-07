import { disposeWith, disposeBoth } from '@most/disposable'
import { Stream, Disposable, Scheduler, Sink } from '@most/types' // eslint-disable-line no-unused-vars

export default class FakeDisposeStream<A> {
  private readonly source: Stream<A>
  private readonly disposable: Disposable

  static from<A> (disposer: () => void, source: Stream<A>): FakeDisposeStream<A> {
    return new FakeDisposeStream(disposer, source)
  }

  constructor (disposer: () => void, source: Stream<A>) {
    this.source = source
    this.disposable = disposeWith(disposer, undefined)
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return disposeBoth(this.source.run(sink, scheduler), this.disposable)
  }
}
