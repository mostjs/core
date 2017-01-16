import { Stream } from '../types';

export function reduce<A, B>(f: (b: B, a: A) => B, b: B, s: Stream<A>): Promise<B>;
export function reduce<A, B>(f: (b: B, a: A) => B): (b: B, s: Stream<A>) => Promise<B>;
export function reduce<A, B>(f: (b: B, a: A) => B, b: B): (s: Stream<A>) => Promise<B>;
export function reduce<A, B>(f: (b: B, a: A) => B): (b: B) => (s: Stream<A>) => Promise<B>;