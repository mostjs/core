import { Stream } from '@most/types';

export function merge<A>(...streams: Array<Stream<A>>): Stream<A>;
export function mergeArray<A>(streams: Array<Stream<A>>): Stream<A>;
