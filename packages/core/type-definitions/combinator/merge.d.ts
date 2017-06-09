import { Stream } from '@most/types';

export function merge<A>(s1: Stream<A>, s2: Stream<A>): Stream<A>;
export function merge<A>(s1: Stream<A>): (s2: Stream<A>) => Stream<A>
export function mergeArray<A>(streams: Array<Stream<A>>): Stream<A>;
