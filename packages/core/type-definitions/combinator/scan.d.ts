import { Stream } from '@most/types';

export function scan<A, B>(f: (b: B, a: A) => B, b: B, s: Stream<A>): Stream<B>;
export function scan<A, B>(f: (b: B, a: A) => B): (b: B, s: Stream<A>) => Stream<B>;
export function scan<A, B>(f: (b: B, a: A) => B, b: B): (s: Stream<A>) => Stream<B>;
export function scan<A, B>(f: (b: B, a: A) => B): (b: B) => (s: Stream<A>) => Stream<B>;
