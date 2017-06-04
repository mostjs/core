import { Stream } from '@most/types';

export function merge<A>(a: Stream<A>, b: Stream<A>): Stream<A>;
export function mergeArray<A>(streams: Array<Stream<A>>): Stream<A>;
