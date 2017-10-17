import { Stream } from '@most/types'

export function zipItems <A, B, C> (f: (a: A, b: B) => C, a: Array<A>, s: Stream<B>): Stream<C>;
export function zipItems <A, B, C> (f: (a: A, b: B) => C): (a: Array<A>, s: Stream<B>) => Stream<C>;
export function zipItems <A, B, C> (f: (a: A, b: B) => C, a: Array<A>): (s: Stream<B>) => Stream<C>;
export function zipItems <A, B, C> (f: (a: A, b: B) => C): (a: Array<A>) => (s: Stream<B>) => Stream<C>;

export function withItems <A> (a: Array<A>, s: Stream<any>): Stream<A>
export function withItems <A> (a: Array<A>): (s: Stream<any>) => Stream<A>
