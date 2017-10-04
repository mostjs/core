import { Stream } from '@most/types';

export function withLatestFrom <A, B> (values: Stream<A>, s: Stream<B>): Stream<A>
export function withLatestFrom <A, B> (values: Stream<A>): (s: Stream<B>) => Stream<A>

// all 3 args
export function zipLatestFrom<A, B, C>(f: (a: A, b: B) => C, values: Stream<A>, s: Stream<B>): Stream<C>;
// first arg then 2
export function zipLatestFrom<A, B, C>(f: (a: A, b: B) => C): (values: Stream<A>, s: Stream<B>) => Stream<C>;
// first 2 then 1
export function zipLatestFrom<A, B, C>(f: (a: A, b: B) => C, values: Stream<A>): (s: Stream<B>) => Stream<C>;
// 1 arg at a time
export function zipLatestFrom<A, B, C>(f: (a: A, b: B) => C): (values: Stream<A>) => (s: Stream<B>) => Stream<C>;
