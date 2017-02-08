import { Stream } from '../types';

export function zip<A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>, b: Stream<B>): Stream<R>;
export function zip<A, B, C, R>(fn: (a: A, b: B, c: C) => R, a: Stream<A>, b: Stream<B>, c: Stream<C>): Stream<R>;
export function zip<A, B, C, D, R>( fn: (a: A, b: B, c: C, d: D) => R, a: Stream<A>, b: Stream<B>, c: Stream<C>, d: Stream<D>): Stream<R>;
export function zip<A, B, C, D, E, R>(fn: (a: A, b: B, c: C, d: D, e: E) => R, a: Stream<A>, b: Stream<B>, c: Stream<C>, d: Stream<D>, e: Stream<E>): Stream<R>;
export function zip<R>(f: (...args: any[]) => R, ...streams: Stream<any>[]): Stream<R>;

export function zipArray<A, B, R>(
  fn: (a: A, b: B) => R,
  streams: [Stream<A>, Stream<B>]
): Stream<R>;
export function zipArray<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R,
  streams: [Stream<A>, Stream<B>, Stream<C>]
): Stream<R>;
export function zipArray<A, B, C, D, R>(
  fn: (a: A, b: B, c: C, d: D) => R,
  streams: [Stream<A>, Stream<B>, Stream<C>, Stream<D>]
): Stream<R>;
export function zipArray<A, B, C, D, E, R>(
  fn: (a: A, b: B, c: C, d: D, e: E) => R,
  streams: [Stream<A>, Stream<B>, Stream<C>, Stream<D>, Stream<E>]
): Stream<R>;
export function zipArray<V, R> (
  fn: (...items: V[]) => R,
  items: Stream<V>[]
): Stream<R>;

export function zipArray<A, B, R>(fn: (a: A, b: B) => R):
  (streams: [Stream<A>, Stream<B>]) => Stream<R>;

export function zipArray<A, B, C, R>(fn: (a: A, b: B, c: C)=> R):
  (streams: [Stream<A>, Stream<B>, Stream<C>]) => Stream<R>;

export function zipArray<A, B, C, D, R>(fn: (a: A, b: B, c: C, d: D) => R):
  (streams: [Stream<A>, Stream<B>, Stream<C>, Stream<D>]) => Stream<R>;

export function zipArray<A, B, C, D, E, R>(fn: (a: A, b: B, c: C, d: D, e: E) => R):
  (streams: [Stream<A>, Stream<B>, Stream<C>, Stream<D>, Stream<E>]) => Stream<R>;

export function zipArray<V, R> (fn: (...items: V[]) => R):
  (items: Stream<V>[]) => Stream<R>;
