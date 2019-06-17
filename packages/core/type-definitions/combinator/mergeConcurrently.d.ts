import { Stream } from '@most/types';

export function mergeConcurrently<A>(concurrency: number, s: Stream<Stream<A>>): Stream<A>;
export function mergeConcurrently<A>(concurrency: number): (s: Stream<Stream<A>>) => Stream<A>;

export function mergeMapConcurrently<A, B>(f: (a: A) => Stream<B>, concurrency: number, s: Stream<A>): Stream<B>;
export function mergeMapConcurrently<A, B>(f: (a: A) => Stream<B>): (concurrency: number, s: Stream<A>) => Stream<B>;
export function mergeMapConcurrently<A, B>(f: (a: A) => Stream<B>, concurrency: number): (s: Stream<A>) => Stream<B>;
export function mergeMapConcurrently<A, B>(f: (a: A) => Stream<B>): (concurrency: number) => (s: Stream<A>) => Stream<B>;
