import { Stream } from '@most/types';

export function map<A, B>(f: (a: A) => B, s: Stream<A>): Stream<B>;
export function map<A, B>(f: (a: A) => B): (s: Stream<A>) => Stream<B>;

export function tap<A>(f: (a: A) => any, s: Stream<A>): Stream<A>;
export function tap<A>(f: (a: A) => any): (s: Stream<A>) => Stream<A>;

export function constant<A, B>(b: B, s: Stream<A>): Stream<B>;
export function constant<A, B>(b: B): (s: Stream<A>) => Stream<B>;
