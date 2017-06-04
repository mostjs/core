import { Stream } from '@most/types';

export function merge<A, B, R>(a: Stream<A>, b: Stream<B>): Stream<R>;
export function mergeArray<A>(streams: Array<Stream<A>>): Stream<A>;
