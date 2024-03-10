import { Stream, Sink, Scheduler, Disposable } from '@most/types'
import {
  continueWith,
  empty,
  filter,
  map,
  ap,
  now,
  chain,
  never
} from '../../core'

interface FunctorFantasyLand<A> {
  ['fantasy-land/map']<B>(fn: (a: A) => B): FunctorFantasyLand<B>
}

export const fantasyLand = <A>(stream: Stream<A>): FantasyLandStream<A> =>
  new FantasyLandStream(stream)

export class FantasyLandStream<A> implements Stream<A>, FunctorFantasyLand<A> {
  constructor(private readonly stream: Stream<A>) {}

  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.stream.run(sink, scheduler)
  }

  ['fantasy-land/concat'](nextStream: Stream<A>): FantasyLandStream<A> {
    return fantasyLand<A>(continueWith(() => nextStream, this.stream))
  }

  ['fantasy-land/empty']<B>() {
    return fantasyLand<B>(empty())
  }

  ['fantasy-land/filter'](predicate: (value: A) => boolean) {
    return fantasyLand<A>(filter(predicate, this.stream))
  }

  ['fantasy-land/map']<B>(fn: (value: A) => B): FantasyLandStream<B> {
    return fantasyLand<B>(map(fn, this.stream))
  }

  ['fantasy-land/ap']<B>(mapper: Stream<(value: A) => B>) {
    return fantasyLand<B>(ap(mapper, this.stream))
  }

  ['fantasy-land/of']<B>(value: B) {
    return fantasyLand<B>(now(value))
  }

  ['fantasy-land/chain']<B>(fn: (value: A) => Stream<B>) {
    return fantasyLand<B>(chain(fn, this.stream))
  }

  ['fantasy-land/zero']() {
    return fantasyLand<A>(never())
  }
}
