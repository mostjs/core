import { Stream } from '@most/types';

export function zip<A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>, b: Stream<B>): Stream<R>;
export function zip<A, B, R>(fn: (a: A, b: B) => R): (a: Stream<A>, b: Stream<B>) => Stream<R>;
export function zip<A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>): (b: Stream<B>) => Stream<R>;
export function zip<A, B, R>(fn: (a: A, b: B) => R): (a: Stream<A>) => (b: Stream<B>) => Stream<R>;

type ToStreams<A extends ReadonlyArray<any>> = {
  [K in keyof A]: Stream<A[K]>
}

export function zipArray<Args extends any[], R>(fn: (...args: Args) => R, streams: ToStreams<Args>): Stream<R>;
export function zipArray<Args extends any[], R>(fn: (...args: Args) => R): (streams: ToStreams<Args>) => Stream<R>;
