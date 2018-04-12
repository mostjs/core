import { Stream } from '@most/types';

export function merge<A, B>(s1: Stream<A>, s2: Stream<B>): Stream<A | B>;
export function merge<A, B>(s1: Stream<A>): (s2: Stream<B>) => Stream<A | B>
export function mergeArray<A>(streams: Array<Stream<A>>): Stream<A>;
