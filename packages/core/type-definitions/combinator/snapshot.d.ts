import { Stream } from '@most/types';

export function sample <A, B> (values: Stream<A>, sampler: Stream<B>): Stream<A>;
export function sample <A, B> (values: Stream<A>): (sampler: Stream<B>) => Stream<A>;

// all 3 args
export function snapshot <A, B, C>(f: (a: A, b: B) => C, values: Stream<A>, sampler: Stream<B>): Stream<C>;
// first 1 then 2
export function snapshot <A, B, C>(f: (a: A, b: B) => C): (values: Stream<A>, sampler: Stream<B>) => Stream<C>;
// first 2 then 1
export function snapshot <A, B, C>(f: (a: A, b: B) => C, values: Stream<A>): (sampler: Stream<B>) => Stream<C>;
// 1 arg at a time
export function snapshot <A, B, C>(f: (a: A, b: B) => C): (values: Stream<A>) => (sampler: Stream<B>) => Stream<C>;
