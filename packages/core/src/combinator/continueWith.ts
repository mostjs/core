/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { run } from '../run'
import { withLocalTime } from './withLocalTime'
import { disposeOnce, tryDispose } from '@most/disposable'
import { Stream, Scheduler, Time, Disposable, Sink } from '@most/types'

export const continueWith = <A>(f: () => Stream<A>, stream: Stream<A>): Stream<A> =>
  new ContinueWith(f, stream)

class ContinueWith<A> implements Stream<A> {
  private readonly f: () => Stream<A>
  private readonly source: Stream<A>

  constructor (f: () => Stream<A>, source: Stream<A>) {
    this.f = f
    this.source = source
  }

  run (sink: Sink<A>, scheduler: Scheduler): Disposable {
    return new ContinueWithSink(this.f, this.source, sink, scheduler)
  }
}

class ContinueWithSink<A> extends Pipe<A> implements Sink<A>, Disposable {
  private readonly f: () => Stream<A>;
  private readonly scheduler: Scheduler;
  private active: boolean;
  private disposable: Disposable

  constructor (f: () => Stream<A>, source: Stream<A>, sink: Sink<A>, scheduler: Scheduler) {
    super(sink)
    this.f = f
    this.scheduler = scheduler
    this.active = true
    this.disposable = disposeOnce(source.run(this, scheduler))
  }

  event (t: Time, x: A): void {
    if (!this.active) {
      return
    }
    this.sink.event(t, x)
  }

  end (t: Time): void {
    if (!this.active) {
      return
    }

    tryDispose(t, this.disposable, this.sink)

    this.startNext(t, this.sink)
  }

  private startNext (t: Time, sink: Sink<A>): void {
    try {
      this.disposable = this.continue(this.f, t, sink)
    } catch (e) {
      sink.error(t, e)
    }
  }

  private continue (f: () => Stream<A>, t: Time, sink: Sink<A>): Disposable {
    return run(sink, this.scheduler, withLocalTime(t, f()))
  }

  dispose (): void {
    this.active = false
    return this.disposable.dispose()
  }
}
