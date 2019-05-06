import { Stream } from '@most/types';

export function merge<A, B>(s1: Stream<A>, s2: Stream<B>): Stream<A | B>;
export function merge<A, B>(s1: Stream<A>): (s2: Stream<B>) => Stream<A | B>

type MergeArray<S extends ReadonlyArray<Stream<any>>> = Value<S[number]>
type Value<S> = S extends Stream<infer A> ? A : never

export function mergeArray<S extends ReadonlyArray<Stream<any>>>(streams: S): Stream<MergeArray<S>>;
