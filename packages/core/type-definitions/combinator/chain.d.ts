import { Stream } from '@most/types';

export function chain<A, B>(f: (value: A) => Stream<B>, stream: Stream<A>): Stream<B>;
export function chain<A, B>(f: (value: A) => Stream<B>): (stream: Stream<A>) => Stream<B>;

export function join<A>(higherOrderStream: Stream<Stream<A>>): Stream<A>;
