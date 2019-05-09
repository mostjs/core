import { Stream } from '@most/types';

export function combine<A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>, b: Stream<B>): Stream<R>;
export function combine<A, B, R>(fn: (a: A, b: B) => R): (a: Stream<A>, b: Stream<B>) => Stream<R>;
export function combine<A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>): (b: Stream<B>) => Stream<R>;
export function combine<A, B, R>(fn: (a: A, b: B) => R): (a: Stream<A>) => (b: Stream<B>) => Stream<R>;

// TODO: use readonly any[] once TS 3.4.x has been in the wild for "enough" time
type ToStreamsArray<A extends ReadonlyArray<any>> = {
  [K in keyof A]: Stream<A[K]>
}

export function combineArray<Args extends any[], R>(fn: (...args: Args) => R, streams: ToStreamsArray<Args>): Stream<R>;
export function combineArray<Args extends any[], R>(fn: (...args: Args) => R): (streams: ToStreamsArray<Args>) => Stream<R>;
