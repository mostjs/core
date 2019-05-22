import { Stream } from '@most/types';
import { ToStreamsArray } from './variadic'

export function zip<A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>, b: Stream<B>): Stream<R>;
export function zip<A, B, R>(fn: (a: A, b: B) => R): (a: Stream<A>, b: Stream<B>) => Stream<R>;
export function zip<A, B, R>(fn: (a: A, b: B) => R, a: Stream<A>): (b: Stream<B>) => Stream<R>;
export function zip<A, B, R>(fn: (a: A, b: B) => R): (a: Stream<A>) => (b: Stream<B>) => Stream<R>;

export function zipArray<Args extends any[], R>(fn: (...args: Args) => R, streams: ToStreamsArray<Args>): Stream<R>;
export function zipArray<Args extends any[], R>(fn: (...args: Args) => R): (streams: ToStreamsArray<Args>) => Stream<R>;
