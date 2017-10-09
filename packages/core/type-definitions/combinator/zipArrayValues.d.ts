import { Stream } from '@most/types'

export function zipArrayValues <A, B, C> (f: (a: A, b: B) => C, a: Array<A>, s: Stream<B>): Stream<C>;
export function zipArrayValues <A, B, C> (f: (a: A, b: B) => C): (a: Array<A>, s: Stream<B>) => Stream<C>;
export function zipArrayValues <A, B, C> (f: (a: A, b: B) => C, a: Array<A>): (s: Stream<B>) => Stream<C>;
export function zipArrayValues <A, B, C> (f: (a: A, b: B) => C): (a: Array<A>) => (s: Stream<B>) => Stream<C>;

export function withArrayValues <A> (a: Array<A>, s: Stream<any>): Stream<A>
export function withArrayValues <A> (a: Array<A>): (s: Stream<any>) => Stream<A> 
