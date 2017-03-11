import { Stream } from '@most/types';

export function concatMap<A, B>(f: (a: A) => Stream<B>, stream: Stream<A>): Stream<B>;
export function concatMap<A, B>(f: (a: A) => Stream<B>): (stream: Stream<A>) => Stream<B>;
