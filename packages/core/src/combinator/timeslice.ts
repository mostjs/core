/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

import Pipe from '../sink/Pipe'
import { disposeBoth } from '@most/disposable'
import { join } from './chain'
import SettableDisposable from '../disposable/SettableDisposable'
import { Stream, Scheduler, Sink, Disposable, Time } from '@most/types'

export const until = <A>(signal: Stream<unknown>, stream: Stream<A>): Stream<A> =>
  new Until(signal, stream)

export const since = <A>(signal: Stream<unknown>, stream: Stream<A>): Stream<A> =>
  new Since(signal, stream)

export const during = <A>(timeWindow: Stream<Stream<unknown>>, stream: Stream<A>): Stream<A> =>
  until(join(timeWindow), since(timeWindow, stream))

class Until<A> implements Stream<A> {
  private readonly maxSignal: Stream<unknown>
  private readonly source: Stream<A>

  constructor(maxSignal: Stream<unknown>, source: Stream<A>) {
    this.maxSignal = maxSignal
    this.source = source
  }

  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    const disposable = new SettableDisposable()

    const d1 = this.source.run(sink, scheduler)
    const d2 = this.maxSignal.run(new UntilSink(sink, disposable), scheduler)
    disposable.setDisposable(disposeBoth(d1, d2))

    return disposable
  }
}

class Since<A> implements Stream<A> {
  private readonly minSignal: Stream<Stream<unknown>>
  private readonly source: Stream<A>

  constructor(minSignal: Stream<Stream<unknown>>, source: Stream<A>) {
    this.minSignal = minSignal
    this.source = source
  }

  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    const min = new LowerBoundSink(this.minSignal, sink, scheduler)
    const d = this.source.run(new SinceSink(min, sink), scheduler)

    return disposeBoth(min, d)
  }
}

class SinceSink<A> extends Pipe<A, A> implements Sink<A> {
  private readonly min: LowerBoundSink<A>

  constructor(min: LowerBoundSink<A>, sink: Sink<A>) {
    super(sink)
    this.min = min
  }

  event(t: Time, x: A): void {
    if (this.min.allow) {
      this.sink.event(t, x)
    }
  }
}

class LowerBoundSink<A> extends Pipe<A, A> implements Sink<A>, Disposable {
  allow: boolean
  private disposable: Disposable

  constructor(signal: Stream<unknown>, sink: Sink<A>, scheduler: Scheduler) {
    super(sink)
    this.allow = false
    this.disposable = signal.run(this, scheduler)
  }

  event(): void {
    this.allow = true
    this.dispose()
  }

  end(): void {}

  dispose(): void {
    this.disposable.dispose()
  }
}

class UntilSink<A> extends Pipe<A, A> implements Sink<A> {
  private readonly disposable: Disposable

  constructor(sink: Sink<A>, disposable: Disposable) {
    super(sink)
    this.disposable = disposable
  }

  event(t: Time): void {
    this.disposable.dispose()
    this.sink.end(t)
  }

  end(): void {}
}
